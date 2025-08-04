// src/components/CountryCounter.jsx
import React from 'react';
import { Globe, Loader2, TrendingUp } from 'lucide-react';

const CountryCounter = ({ selectedCount = 0, loading = false, className = "" }) => {
  const allCountries = 195; // Total number of countries in the world
  const percentage = Math.round((selectedCount / allCountries) * 100);
  
  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 transition-all duration-300 hover:shadow-xl ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {loading ? (
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
          ) : (
            <Globe className="h-6 w-6 text-blue-500" />
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Countries Visited</p>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          
          <div className="flex items-baseline space-x-2 mt-1">
            <p className="text-2xl font-bold text-gray-800">
              {loading ? '--' : selectedCount}
            </p>
            <p className="text-lg text-gray-500">/ {allCountries}</p>
          </div>
          
          {!loading && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!loading && selectedCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            {selectedCount === allCountries 
              ? "🎉 World Explorer Complete!" 
              : `${allCountries - selectedCount} more to explore`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CountryCounter;