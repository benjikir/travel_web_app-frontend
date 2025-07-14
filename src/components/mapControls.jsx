import 'leaflet/dist/leaflet.css';
import '@maptiler/leaflet-maptilersdk';


const MapControls = ({ onZoomIn, onZoomOut, onReset }) => (
  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
    <button onClick={onZoomIn} className="bg-white border rounded px-2 py-1 shadow">+</button>
    <button onClick={onZoomOut} className="bg-white border rounded px-2 py-1 shadow">-</button>
    <button onClick={onReset} className="bg-white border rounded px-2 py-1 shadow">Reset</button>
  </div>
);

export default MapControls;