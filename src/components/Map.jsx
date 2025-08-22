// src/components/Map.jsx
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
  const [markerPosition, setMarkerPosition] = useState(null);

  // helper: reverse geocode a lat/lng using MapTiler Geocoding API
  async function reverseGeocode(lat, lng) {
    try {
      const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}&limit=1`;
      const r = await fetch(url);
      if (!r.ok) return null;
      const data = await r.json();
      const feat = data?.features?.[0];
      if (!feat) return null;

      const name = feat.properties?.name || feat.text || "";
      const category = feat.properties?.category || feat.properties?.type || "";
      const address = feat.properties?.formatted || feat.properties?.label || "";

      // return simple HTML for popup
      return `
        <div class="text-sm">
          <strong>${name || "Unknown place"}</strong>
          ${category ? `<div class="text-xs text-gray-600">${category}</div>` : ""}
          ${address ? `<div class="text-xs text-gray-700 mt-1">${address}</div>` : ""}
          <div class="text-xs text-gray-500 mt-2">Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}</div>
        </div>
      `;
    } catch (err) {
      console.error("reverseGeocode error:", err);
      return null;
    }
  }

  useEffect(() => {
    if (!map.current) {
      map.current = new L.Map(mapContainer.current, {
        center: L.latLng(center.lat, center.lng),
        zoom: initialZoom,
        zoomControl: false,
      });

      // click handler: set marker and show popup with reverse geocode (POI/address)
      map.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition(e.latlng);

        // remove previous marker if any
        if (markerRef.current) {
          map.current.removeLayer(markerRef.current);
          markerRef.current = null;
        }

        // add marker
        markerRef.current = L.marker([lat, lng]).addTo(map.current);

        // fetch POI/address info and open popup
        const popupHtml = await reverseGeocode(lat, lng);
        if (popupHtml) {
          markerRef.current.bindPopup(popupHtml).openPopup();
        } else {
          markerRef.current.bindPopup(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`).openPopup();
        }
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

  // This useEffect highlights visited countries from the Flask API
  useEffect(() => {
    if (travelData?.userCountries) {
      console.log("Map: Highlighting visited countries:", travelData.userCountries);
      // Implement your Leaflet/Maptiler logic here to actually highlight countries.
      // You'll need geographic data for countries (e.g., GeoJSON boundaries).
      // You can access the visited countries through travelData.userCountries
      // Each userCountry should have country information
    }
  }, [travelData?.userCountries]);

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

        {/* Country Counter - shows visited countries from API */}
        <div className="absolute bottom-4 right-4 z-10">
          <CountryCounter 
            selectedCount={travelData?.userCountries?.length || 0} 
            loading={travelData?.loading?.userCountries || false}
          />
        </div>
      </div>

      {/* Right Column: Locations and Trips */}
      <div className="w-full lg:w-1/3 h-1/2 lg:h-full p-4 bg-gray-100 flex flex-col gap-4">
        <div className="flex-1">
          <Locations travelData={travelData} />
        </div>
        <div className="flex-1">
          <Trips travelData={travelData} />
        </div>
      </div>
    </div>
  );
};

export default Map;