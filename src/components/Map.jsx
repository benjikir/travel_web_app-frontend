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
  const countriesLayerRef = useRef(null);

  const visitedCountryIds = useMemo(() => {
    if (!travelData.locations || travelData.locations.length === 0) return new Set();
    const ids = travelData.locations.map(loc => loc.country_id).filter(Boolean);
    const idSet = new Set(ids);
    console.log('[DEBUG 1] Besuchte Länder-IDs (aus DB):', idSet);
    return idSet;
  }, [travelData.locations]);

  // --- KORREKTUR 1: useEffect NUR für die Karten-Initialisierung ---
  // Dieser Hook läuft nur EINMAL, wenn die Komponente zum ersten Mal geladen wird.
  useEffect(() => {
    if (map.current) return; // Verhindert doppelte Initialisierung

    map.current = new L.Map(mapContainer.current, {
      center: L.latLng(center.lat, center.lng),
      zoom: initialZoom,
      zoomControl: false,
    });

    // Der Klick-Handler wird hier einmalig und dauerhaft hinzugefügt.
    map.current.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) { map.current.removeLayer(markerRef.current); }
      markerRef.current = L.marker([lat, lng]).addTo(map.current).bindPopup(`Loading...`).openPopup();
      const locationData = await reverseGeocode(lat, lng);
      setNewLocation({ ...locationData, id: Date.now() });
      setTimeout(() => { if (markerRef.current) { map.current.removeLayer(markerRef.current); } }, 500);
    });
    
    // Cleanup-Funktion, die die Karte entfernt, wenn die Komponente zerstört wird.
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Das leere Array [] ist entscheidend, damit dies nur einmal ausgeführt wird.

  // --- KORREKTUR 2: useEffect NUR für das Ändern des Karten-Stils (Tile Layer) ---
  useEffect(() => {
    if (!map.current) return; // Warten, bis die Karte initialisiert ist.

    if (tileLayerRef.current) {
      map.current.removeLayer(tileLayerRef.current);
    }
    tileLayerRef.current = new MaptilerLayer({ apiKey, style }).addTo(map.current);

    // Stellen Sie sicher, dass die Länder-Ebene immer im Hintergrund bleibt.
    if (countriesLayerRef.current) {
      countriesLayerRef.current.bringToBack();
    }
  }, [style, apiKey]);

  // --- KORREKTUR 3: useEffect NUR für das Zeichnen der Länder-Ebene ---
  useEffect(() => {
    if (!map.current) return; // Warten, bis die Karte initialisiert ist.

    const fetchAndDrawCountries = async () => {
      try {
        console.log('[DEBUG 2] Versuche, /countries.geojson zu laden...');
        const response = await fetch('/countries.geojson');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        console.log('[DEBUG 3] countries.geojson erfolgreich geladen.');
        const geojsonData = await response.json();

        if (countriesLayerRef.current) {
          map.current.removeLayer(countriesLayerRef.current);
        }

        countriesLayerRef.current = L.geoJSON(geojsonData, {
          style: (feature) => {
            const countryId = feature.properties.id;
            const isVisited = visitedCountryIds.has(countryId);

            if (isVisited) {
                console.log(`[DEBUG 4 - TREFFER!] Land (ID: ${countryId}) wird markiert.`);
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
        console.error("Fehler im fetchAndDrawCountries-Effekt:", error);
      }
    };

    fetchAndDrawCountries();
  }, [visitedCountryIds]); // Dieser Hook hängt nur von den besuchten Ländern ab.


  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleResetView = () => { map.current?.setView([center.lat, center.lng], initialZoom); if (markerRef.current) { map.current.removeLayer(markerRef.current); } setNewLocation(null); };

  return (
    <div className="flex flex-col lg:flex-row h-[90vh] overflow-hidden shadow-lg border-white">
      <div className="relative w-full lg:w-2/3 h-1/2 lg:h-full">
        <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleResetView} />
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