// src/components/MapControls.jsx
import React from "react";
import { ZoomIn, ZoomOut, Home, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapControls = ({ 
  onZoomIn, 
  onZoomOut, 
  onReset, 
  onLocate, 
  isLocating = false,
  className = "" 
}) => {
  return (
    <div className={`absolute top-4 left-4 z-10 flex flex-col gap-2 ${className}`}>
      
      {/* Zoom In Button */}
      <Button
        onClick={onZoomIn}
        size="icon"
        variant="outline"
        className="h-10 w-10 bg-white/90 backdrop-blur-sm border border-gray-200
                   hover:bg-white hover:scale-105 hover:shadow-lg hover:border-blue-300
                   active:scale-95 transition-all duration-200 ease-out
                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   group"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4 text-gray-700 transition-colors duration-200 
                         group-hover:text-blue-600" />
      </Button>

      {/* Zoom Out Button */}
      <Button
        onClick={onZoomOut}
        size="icon"
        variant="outline"
        className="h-10 w-10 bg-white/90 backdrop-blur-sm border border-gray-200
                   hover:bg-white hover:scale-105 hover:shadow-lg hover:border-blue-300
                   active:scale-95 transition-all duration-200 ease-out
                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   group"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4 text-gray-700 transition-colors duration-200 
                          group-hover:text-blue-600" />
      </Button>

      {/* Reset View Button */}
      <Button
        onClick={onReset}
        size="icon"
        variant="outline"
        className="h-10 w-10 bg-white/90 backdrop-blur-sm border border-gray-200
                   hover:bg-white hover:scale-105 hover:shadow-lg hover:border-orange-300
                   active:scale-95 transition-all duration-200 ease-out
                   focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                   group"
        title="Reset View"
      >
        <Home className="h-4 w-4 text-gray-700 transition-colors duration-200 
                        group-hover:text-orange-600" />
      </Button>

      {/* Locate Button with Loading State */}
      <Button
        onClick={onLocate}
        size="icon"
        variant="outline"
        disabled={isLocating}
        className="h-10 w-10 bg-white/90 backdrop-blur-sm border border-gray-200
                   hover:bg-white hover:scale-105 hover:shadow-lg hover:border-green-300
                   active:scale-95 transition-all duration-200 ease-out
                   focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                   disabled:opacity-70 disabled:cursor-not-allowed 
                   disabled:hover:scale-100 disabled:hover:shadow-none
                   disabled:hover:border-gray-200
                   group relative overflow-hidden"
        title={isLocating ? "Locating..." : "Find My Location"}
      >
        {/* Loading Animation Background */}
        {isLocating && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 
                          animate-pulse" />
        )}
        
        {isLocating ? (
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin relative z-10" />
        ) : (
          <MapPin className="h-4 w-4 text-gray-700 transition-colors duration-200 
                           group-hover:text-green-600 relative z-10" />
        )}
        
        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        translate-x-[-100%] group-hover:translate-x-[100%] 
                        transition-transform duration-700 ease-out" />
      </Button>
    </div>
  );
};

export default MapControls;
