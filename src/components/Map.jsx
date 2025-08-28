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

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Map Configuration
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
  const [newLocation, setNewLocation] = useState(null); // State for the new location data from map click
  
  // Helper: reverse geocode a lat/lng using MapTiler Geocoding API
  async function reverseGeocode(lat, lng) {
    try {
      const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}&limit=1`;
      const r = await fetch(url);
      if (!r.ok) return null;
      const data = await r.json();
      const feat = data?.features?.[0];
      if (!feat) return null;
      
      const name = feat.properties?.name || feat.text || "";
      const country = feat.properties?.country || "";
      console.log("reverseGeocode result:", { name, country });
      return { name, country };
    } catch (err) {
      console.error("reverseGeocode error:", err);
      return null;
    }
  }
  
  // Initialize and manage the map instance
  useEffect(() => {
    if (!map.current) {
      map.current = new L.Map(mapContainer.current, {
        center: L.latLng(center.lat, center.lng),
        zoom: initialZoom,
        zoomControl: false,
      });
      
      // Click handler: Set marker and prepare location data for the form
      map.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        
        // Remove previous temporary marker if any
        if (markerRef.current) {
          map.current.removeLayer(markerRef.current);
          markerRef.current = null;
        }
        
        // Add a new temporary marker
        markerRef.current = L.marker([lat, lng]).addTo(map.current);
        
        // Show loading popup on the marker
        markerRef.current.bindPopup(`
          <div class="p-4">
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p class="text-center mt-2">Loading...</p>
          </div>
        `).openPopup();
        
        // Fetch place/address info
        const geocodeData = await reverseGeocode(lat, lng);
        
        // Create a simple location object for the Locations component.
        // It's the Locations component's job to find the country_id.
        const locationDataForForm = {
          name: geocodeData?.name || '',
          country_name: geocodeData?.country || '',
          description: '',
          lat: lat,
          lng: lng
        };
        
        // Update state to pass to the Locations component, which will show the form
        setNewLocation(locationDataForForm);
        
        // We're done with the marker, the form on the right is now the focus.
        // Close the popup after a brief moment.
        setTimeout(() => {
          if (markerRef.current) {
            map.current.removeLayer(markerRef.current);
            markerRef.current = null;
          }
        }, 500);
      });
    }
    
    // Update map style when it changes
    if (tileLayerRef.current) {
      map.current.removeLayer(tileLayerRef.current);
    }
    tileLayerRef.current = new MaptilerLayer({
      apiKey,
      style,
    }).addTo(map.current);
    
    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.off('click'); // Important to remove event listeners
        map.current.remove();
        map.current = null;
      }
    };
  }, [style, apiKey]); // Rerun effect if style or apiKey changes
  
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
  
  // ... (useEffect for highlighting countries can remain the same)
  
  return (
    <div className="flex flex-col lg:flex-row h-[90vh] overflow-hidden shadow-lg border-white">
      {/* Left Column: Map and Overlays */}
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
              <option key={value} value={value} className="text-gray-700">
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="absolute bottom-4 right-4 z-10">
          <CountryCounter 
            selectedCount={travelData?.userCountries || 0} 
            loading={travelData?.loading?.userCountries || false}
          />
        </div>
      </div>
      
      {/* Right Column: Locations and Trips */}
      <div className="w-full lg:w-1/3 h-1/2 lg:h-full p-4 bg-gray-100 flex flex-col gap-4">
        <div className="flex-1">
          <Locations 
            travelData={travelData} 
            mapLocation={newLocation}
            onLocationAdded={() => {
              // Reset location state after successful addition
              setNewLocation(null);
            }}
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