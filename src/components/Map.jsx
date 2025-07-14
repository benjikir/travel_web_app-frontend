import React, { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import MapControls from './mapControls';


const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

const styles = {
  Streets: "streets-v2",
  Satellite: "satellite",
  Dark: "dark-v2",
  Topo: "topo-v2",
  Basic: "basic-v2",
};

const center = { lng: 0, lat: 0 };
const initialZoom = 3;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tileLayerRef = useRef(null);
  const [style, setStyle] = useState(styles.Streets);

  useEffect(() => {
    // Initialize map only once
    if (!map.current) {
      map.current = new L.Map(mapContainer.current, {
        center: L.latLng(center.lat, center.lng),
        zoom: initialZoom,
        zoomControl: false,
      });
    }

    // Remove previous tile layer if exists
    if (tileLayerRef.current) {
      map.current.removeLayer(tileLayerRef.current);
    }

    // Add new tile layer
    tileLayerRef.current = new MaptilerLayer({
      apiKey,
      style,
    }).addTo(map.current);

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [style, apiKey]);

  // Simple controls
  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleResetView = () => map.current?.setView([center.lat, center.lng], initialZoom);

  return (
    <div className="relative w-full h-[90vh] overflow-hidden shadow-lg border-5 border-pink-200">
      {/* Map Controls as a separate component */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleResetView}
      />

      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />

      {/* Style Switcher */}
      <div className="absolute top-4 left-4 z-10">
        <select
          value={style}
          onChange={e => setStyle(e.target.value)}
          className="bg-white border border-gray-300 px-3 py-1 shadow text-sm"
        >
          {Object.entries(styles).map(([label, value]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Map;