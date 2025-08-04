// src/components/MapControls.jsx
import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MapControls = ({ onZoomIn, onZoomOut, onReset, className = "" }) => {
  return (
    <div className={`absolute top-4 left-4 z-10 flex flex-col space-y-2 ${className}`}>
      <Button
        onClick={onZoomIn}
        size="icon"
        variant="secondary"
        className="bg-white/90 hover:bg-white shadow-lg border border-gray-200 transition-all duration-200 hover:scale-105"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4 text-gray-700" />
      </Button>
      
      <Button
        onClick={onZoomOut}
        size="icon"
        variant="secondary"
        className="bg-white/90 hover:bg-white shadow-lg border border-gray-200 transition-all duration-200 hover:scale-105"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4 text-gray-700" />
      </Button>
      
      <Button
        onClick={onReset}
        size="icon"
        variant="secondary"
        className="bg-white/90 hover:bg-white shadow-lg border border-gray-200 transition-all duration-200 hover:scale-105"
        aria-label="Reset to world view"
      >
        <Home className="h-4 w-4 text-gray-700" />
      </Button>
    </div>
  );
};

export default MapControls;