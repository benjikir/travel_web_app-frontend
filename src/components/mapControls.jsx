import 'leaflet/dist/leaflet.css';
import '@maptiler/leaflet-maptilersdk'; // This import is not strictly necessary here, but doesn't hurt.

const MapControls = ({ onZoomIn, onZoomOut, onReset }) => (
  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2"> {/* Changed right-4 to left-4 */}
    <button
      onClick={onZoomIn}
      className="
        bg-white border border-gray-300 rounded-md shadow-sm px-3 py-1 text-base font-semibold text-gray-700
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        transition-colors duration-200 ease-in-out
      "
      aria-label="Zoom In" // Added for accessibility
    >
      +
    </button>
    <button
      onClick={onZoomOut}
      className="
        bg-white border border-gray-300 rounded-md shadow-sm px-3 py-1 text-base font-semibold text-gray-700
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        transition-colors duration-200 ease-in-out
      "
      aria-label="Zoom Out" // Added for accessibility
    >
      -
    </button>
    <button
      onClick={onReset}
      className="
        bg-white border border-gray-300 rounded-md shadow-sm px-3 py-1 text-base font-semibold text-gray-700
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        transition-colors duration-200 ease-in-out
      "
      aria-label="Reset Map View" // Added for accessibility
    >
      Reset
    </button>
  </div>
);

export default MapControls;