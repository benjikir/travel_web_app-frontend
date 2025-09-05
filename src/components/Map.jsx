// src/components/Map.jsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
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
import { reverseGeocode } from '@/utils/geocoding';


// Leaflet Icon Fix
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
  Topo: "topo-v2",
  Basic: "basic-v2",
};
const center = { lng: 0, lat: 0 };
const initialZoom = 2;

const Map = ({ travelData }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tileLayerRef = useRef(null);
  const markerRef = useRef(null);
  const [style, setStyle] = useState(styles.Streets);
  const [newLocation, setNewLocation] = useState(null);

  const visitedCountriesCount = useMemo(() => {
    const ids = new Set(travelData.locations.map(loc => loc.country_id).filter(Boolean));
    return ids.size;
  }, [travelData.locations]);

  useEffect(() => {
    if (!map.current) {
      map.current = new L.Map(mapContainer.current, {
        center: L.latLng(center.lat, center.lng),
        zoom: initialZoom,
        zoomControl: false,
      });

      map.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;

        // Remove previous marker
        if (markerRef.current) {
          map.current.removeLayer(markerRef.current);
          markerRef.current = null;
        }

        // Add temporary marker with loading popup
        markerRef.current = L.marker([lat, lng]).addTo(map.current);
        markerRef.current.bindPopup(`
          <div class="p-4 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2">Loading...</p>
          </div>
        `).openPopup();

        // Reverse geocode using MapTiler
        const locationData = await reverseGeocode(lat, lng, travelData.countries);
        setNewLocation({...locationData, id: Date.now() });

        // Remove temporary marker after short delay
        setTimeout(() => {
          if (markerRef.current) {
            map.current.removeLayer(markerRef.current);
            markerRef.current = null;
          }
        }, 500);
      });
    }

    // Update map style
    if (tileLayerRef.current) {
      map.current.removeLayer(tileLayerRef.current);
    }
    tileLayerRef.current = new MaptilerLayer({ apiKey, style }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.off('click');
        map.current.remove();
        map.current = null;
      }
    };
  }, [style, apiKey, travelData.countries]);

  // Map control handlers
  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleResetView = () => {
    map.current?.setView([center.lat, center.lng], initialZoom);
    if (markerRef.current) {
      map.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    setNewLocation(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[90vh] overflow-hidden shadow-lg border-white">
      {/* Left Column: Map */}
      <div className="relative w-full lg:w-2/3 h-1/2 lg:h-full">
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetView}
        />
        <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />
        <div className="absolute top-6 right-4 z-10">
          <select
            value={style}
            onChange={e => setStyle(e.target.value)}
            className="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 appearance-none"
          >
            {Object.entries(styles).map(([label, value]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="absolute bottom-4 right-4 z-10">
          <CountryCounter
            selectedCount={visitedCountriesCount}
            loading={travelData?.loading?.locations || false}
          />
        </div>
      </div>

      {/* Right Column: Locations and Trips */}
      <div className="w-full lg:w-1/3 h-1/2 lg:h-full p-4 bg-gray-100 flex flex-col gap-4">
        <div className="flex-1">
          <Locations
            travelData={travelData}
            mapLocation={newLocation}  // <- city & state werden hier automatisch übergeben
            onLocationAdded={() => setNewLocation(null)}
          />
        </div>
        <div className="flex-1">
          <Trips travelData={travelData} />
        </div>
      </div>
    </div>
  );
};

export default Map;
