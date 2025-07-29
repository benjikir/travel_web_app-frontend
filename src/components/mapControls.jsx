// MapControls.jsx
import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const MapControls = ({ onZoomIn, onZoomOut, onReset }) => {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
      <button
        onClick={onZoomIn}
        className="bg-white bg-opacity-80 rounded-md p-2 shadow-md hover:bg-opacity-100 transition-all"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-5 w-5 text-gray-700" />
      </button>
      <button
        onClick={onZoomOut}
        className="bg-white bg-opacity-80 rounded-md p-2 shadow-md hover:bg-opacity-100 transition-all"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-5 w-5 text-gray-700" />
      </button>
      <button
        onClick={onReset}
        className="bg-white bg-opacity-80 rounded-md p-2 shadow-md hover:bg-opacity-100 transition-all"
        aria-label="Reset view"
      >
        <RotateCcw className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  );
};

export default MapControls;