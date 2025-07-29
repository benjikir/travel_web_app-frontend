import React, { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import MapControls from './MapControls';  
import Locations from './Locations';     
import Trips from './Trips';           


import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import CountryCounter from './CountryCounter';
import { Kanban } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

const styles = {
  Streets: "streets-v2",
  Satellite: "satellite",
  Dark: "dark-v2",
  Topo: "topo-v2",
  Basic: "basic-v2",
};

const center = { lng: 0, lat: 0 };
const initialZoom = 2;

const Map = ({ countriesToHighlight = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tileLayerRef = useRef(null);
  const markerRef = useRef(null);
  const [style, setStyle] = useState(styles.Streets);
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (!map.current) {
      map.current = new L.Map(mapContainer.current, {
        center: L.latLng(center.lat, center.lng),
        zoom: initialZoom,
        zoomControl: false,
      });

      map.current.on('click', (e) => {
        setMarkerPosition(e.latlng);
      });
    }

    if (tileLayerRef.current) {
      map.current.removeLayer(tileLayerRef.current);
    }

    tileLayerRef.current = new MaptilerLayer({
      apiKey,
      style,
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [style, apiKey]);

  useEffect(() => {
    if (map.current && markerPosition) {
      if (markerRef.current) {
        map.current.removeLayer(markerRef.current);
      }
      markerRef.current = L.marker(markerPosition).addTo(map.current)
        .bindPopup(`<b>Marker Location:</b><br/>Lat: ${markerPosition.lat.toFixed(4)}<br/>Lng: ${markerPosition.lng.toFixed(4)}`)
        .openPopup();
    } else if (map.current && !markerPosition && markerRef.current) {
      map.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  }, [markerPosition]);

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleResetView = () => {
    map.current?.setView([center.lat, center.lng], initialZoom);
    setMarkerPosition(null);
  };

  // This useEffect would be responsible for highlighting countries on the map
  // based on the 'countriesToHighlight' prop.
  useEffect(() => {
      console.log("Map: Highlighting countries:", countriesToHighlight);
      // Implement your Leaflet/Maptiler logic here to actually highlight countries.
      // You'll need geographic data for countries (e.g., GeoJSON boundaries).
  }, [countriesToHighlight]);


  return (
    <div className="flex flex-col lg:flex-row h-[90vh] overflow-hidden shadow-lg border-white">
      {/* Left Column: Map and Overlays */}
      <div className="relative w-full lg:w-2/3 h-1/2 lg:h-full">
        {/* Map Controls */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetView}
        />
        {/* Div for the Leaflet map instance */}
        <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />

        {/* Map Style Selector */}
        <div className="absolute top-6 right-4 z-10">
          <select
            value={style}
            onChange={e => setStyle(e.target.value)}
            className="
              block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              hover:border-gray-400 appearance-none
            "
          >
            {Object.entries(styles).map(([label, value]) => (
              <option key={value} value={value} className="text-gray-700">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* NEW: CountryCountDisplay component - absolutely positioned */}
        <div className="absolute bottom-4 right-4 z-10">
          <CountryCounter selectedCount={countriesToHighlight.length} />
        </div>
      </div>

      {/* Right Column: Locations and Trips */}
      <div className="w-full lg:w-1/3 h-1/2 lg:h-full p-4 bg-gray-100 flex flex-col gap-4">
        <div className="flex-1">
          <Locations /> {/* Your Locations placeholder */}
        </div>
        <div className="flex-1">
          <Trips />     {/* Your Trips placeholder */}
        </div>
      </div>
    </div>
  );
};

export default Map;