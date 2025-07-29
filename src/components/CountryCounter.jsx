// CountryCounter.jsx
import React from 'react';
import { Globe } from 'lucide-react';

const CountryCounter = ({ selectedCount }) => {
  const allCountries = 195; // Total number of countries in the world
  return (
    <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-3 flex items-center">
      <Globe className="h-5 w-5 text-blue-500 mr-2" />
      <div>
        <p className="text-s text-gray-600">Countries Collected</p>
        <p className="font-bold text-gray-800">{selectedCount}/{allCountries}</p>
      </div>
    </div>
  );
};

export default CountryCounter;