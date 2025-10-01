// src/components/Map.jsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import "leaflet/dist/leaflet.css";
import "../styles/leaflet-guard.css";
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
import { countryNameToGeoJsonId } from '@/utils/countryMapping';



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
  const locationMarkerRef = useRef(null);
  const [style, setStyle] = useState(styles.Streets);
  const [newLocation, setNewLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const countriesLayerRef = useRef(null);

  const visitedCountryIds = useMemo(() => {
  if (!travelData.locations || travelData.locations.length === 0) return new Set();
  if (!travelData.countries || travelData.countries.length === 0) return new Set();
  
  console.log("[DEBUG 1] Alle Locations:", travelData.locations);
  
  // ✅ Erstelle ein Mapping von country_id zu country_name
  const countryIdToName = {};
  travelData.countries.forEach(country => {
    countryIdToName[country.country_id] = country.country; // z.B. 85 → "Germany"
  });
  
  console.log("[DEBUG 1a] countryIdToName Mapping:", countryIdToName);
  
  // ✅ Hole alle unique country_ids aus den Locations
  const uniqueCountryIds = [...new Set(
    travelData.locations
      .map(loc => loc.country_id) // Integer IDs wie 85, 106, etc.
      .filter(id => id != null)
  )];
  
  console.log("[DEBUG 1b] Unique country_ids aus DB:", uniqueCountryIds);
  
  // ✅ Konvertiere country_id → country_name → GeoJSON ID
  const countryNames = uniqueCountryIds
    .map(id => countryIdToName[id])
    .filter(Boolean);
  
  console.log("[DEBUG 1c] Konvertierte Ländernamen:", countryNames);
  
  // ✅ Konvertiere Namen zu GeoJSON IDs
  const geoJsonIds = countryNames
    .map(name => countryNameToGeoJsonId[name])
    .filter(Boolean);
  
  console.log("[DEBUG 1d] Finale GeoJSON IDs:", geoJsonIds);
  
  return new Set(geoJsonIds);
}, [travelData.locations, travelData.countries]);

  // Map initialization
  useEffect(() => {
    if (map.current) return;

    map.current = new L.Map(mapContainer.current, {
      center: L.latLng(center.lat, center.lng),
      zoom: initialZoom,
      zoomControl: false,
    });

    map.current.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) { 
        map.current.removeLayer(markerRef.current); 
      }
      markerRef.current = L.marker([lat, lng]).addTo(map.current).bindPopup(`Loading...`).openPopup();
      const locationData = await reverseGeocode(lat, lng);
      setNewLocation({ ...locationData, id: Date.now() });
      setTimeout(() => { 
        if (markerRef.current) { 
          map.current.removeLayer(markerRef.current); 
        } 
      }, 500);
    });

    // Location events
    map.current.on('locationfound', (e) => {
      setIsLocating(false);
      const { latlng, accuracy } = e;
      
      // Remove existing location marker
      if (locationMarkerRef.current) {
        map.current.removeLayer(locationMarkerRef.current);
      }
      
      // Add location marker with accuracy circle
      locationMarkerRef.current = L.marker(latlng, {
        icon: L.icon({
          iconUrl: markerIcon,
          iconRetinaUrl: markerIcon2x,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
      }).addTo(map.current);
      
      // Add accuracy circle
      L.circle(latlng, { radius: accuracy }).addTo(map.current);
      
      // Set view to location
      map.current.setView(latlng, 16);
      
      console.log('Location found:', latlng);
    });

    map.current.on('locationerror', (e) => {
      setIsLocating(false);
      console.error('Location error:', e.message);
      alert(`Location error: ${e.message}`);
    });
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Style layer
  useEffect(() => {
    if (!map.current) return;

    if (tileLayerRef.current) {
      map.current.removeLayer(tileLayerRef.current);
    }
    tileLayerRef.current = new MaptilerLayer({ apiKey, style }).addTo(map.current);

    if (countriesLayerRef.current) {
      setTimeout(() => {
      countriesLayerRef.current.bringToBack();
      }, 100);
    }
  }, [style, apiKey]);

  // Countries layer
  useEffect(() => {
  if (!map.current || !travelData.locations || !travelData.countries) return;

  // Entferne alte Layer
  if (countriesLayerRef.current) {
    countriesLayerRef.current.remove();
  }

  const fetchCountries = async () => {
    try {
      console.log("[DEBUG 2] Versuche, /countries-geo.json zu laden...");
      const response = await fetch('/countries-geo.json');
      const geojsonData = await response.json();
      console.log("[DEBUG 3] countries-geo.json erfolgreich geladen.");

      countriesLayerRef.current = L.geoJSON(geojsonData, {
        style: (feature) => {
          const geoJsonId = feature.id; // z.B. "DEU", "ITA"
          const isVisited = visitedCountryIds.has(geoJsonId);
          
          if (isVisited) {
            console.log(`[DEBUG 4 - TREFFER!] Land (ID: ${geoJsonId}) wird markiert.`);
          }
          
          return {
            fillColor: isVisited ? '#3b82f6' : 'transparent',
            weight: isVisited ? 1.5 : 0,
            color: '#3b82f6',
            fillOpacity: isVisited ? 0.5 : 0,
          };
        }
      }).addTo(map.current);

      countriesLayerRef.current.bringToBack();
    } catch (error) {
      console.error("[ERROR] Fehler beim Laden der Länder:", error);
    }
  };

  fetchCountries();
}, [visitedCountryIds, travelData.locations, travelData.countries]); 
  

// Map control handlers
  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  
  const handleResetView = () => { 
    map.current?.setView([center.lat, center.lng], initialZoom); 
    if (markerRef.current) { 
      map.current.removeLayer(markerRef.current); 
    }
    if (locationMarkerRef.current) {
      map.current.removeLayer(locationMarkerRef.current);
    }
    setNewLocation(null); 
  };

  const handleLocate = () => {
    if (!map.current) return;
    
    setIsLocating(true);
    map.current.locate({
      setView: false, // We'll handle the view manually
      maxZoom: 16,
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[90vh] overflow-hidden shadow-lg border-white">
      <div className="relative w-full lg:w-2/3 h-1/2 lg:h-full">
        <MapControls 
          onZoomIn={handleZoomIn} 
          onZoomOut={handleZoomOut} 
          onReset={handleResetView}
          onLocate={handleLocate}
          isLocating={isLocating}
        />
        <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />
        <div className="absolute top-6 right-4 z-10">
          <select value={style} onChange={e => setStyle(e.target.value)} className="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 appearance-none">
            {Object.entries(styles).map(([label, value]) => (<option key={value} value={value}>{label}</option>))}
          </select>
        </div>
        <div className="absolute bottom-4 right-4 z-10">
          <CountryCounter selectedCount={visitedCountryIds.size} loading={travelData?.loading?.locations || false} />
        </div>
      </div>
      <div className="w-full lg:w-1/3 h-1/2 lg:h-full p-4 bg-gray-100 flex flex-col gap-4">
        <div className="flex-1">
          <Locations travelData={travelData} mapLocation={newLocation} onLocationAdded={() => setNewLocation(null)} />
        </div>
        <div className="flex-1">
          <Trips travelData={travelData} />
        </div>
      </div>
    </div>
  );
};

export default Map;
