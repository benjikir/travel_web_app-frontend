import React, { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './map.css';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";


const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
console.log(apiKey);

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const center = { lng: 13.338414, lat: 52.507932 };
  const [zoom] = useState(12);

  useEffect(() => {
    if (map.current) return;

   
   
    
   map.current = new L.Map(mapContainer.current, {
      center: L.latLng(center.lat, center.lng),
      zoom: zoom
    });

    new MaptilerLayer({
      apiKey: apiKey,
    }).addTo(map.current);

  }, [center.lat, center.lng, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map"></div>
    </div>
  );
};


export default Map;
