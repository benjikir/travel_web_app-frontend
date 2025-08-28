// src/components/Locations.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";


function Locations({ travelData, mapLocation, onLocationAdded }) {
  // CORRECTED: Use the data and functions passed down via props.
  // This ensures we are using the central state from App.jsx.
  const { locations, countries, loading, addLocation, removeLocation } = travelData;

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country_id: '',
    description: '',
    lat: null,
    lng: null
  });

  // Create a map for quick country name lookups from the countries list
  const countryMap = React.useMemo(() => {
    if (!countries) return {};
    return countries.reduce((acc, c) => {
      acc[c.country_id] = c.country;
      return acc;
    }, {});
  }, [countries]);

  // This effect correctly populates the form when a user clicks on the map
  useEffect(() => {
    if (mapLocation) {
      let resolvedCountryId = '';
      if (mapLocation.country_name && countries) {
        const countryFound = countries.find(
          c => c.country.toLowerCase() === mapLocation.country_name.toLowerCase()
        );
        if (countryFound) {
          resolvedCountryId = countryFound.country_id;
        }
      }

      setFormData({
        name: mapLocation.name || '',
        country_id: resolvedCountryId,
        description: mapLocation.description || '',
        lat: mapLocation.lat || null,
        lng: mapLocation.lng || null
      });
      setShowAddForm(true);
    }
  }, [mapLocation, countries]);

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!formData.country_id) {
        alert('Could not auto-detect the country or country not in database. Please select a country from the list.');
        return;
    }
    try {
      await addLocation(formData);
      
      // Reset and hide form
      setShowAddForm(false);
      setFormData({ name: '', country_id: '', description: '', lat: null, lng: null });
      if (onLocationAdded) onLocationAdded();
    } catch (error) {
      alert(`Error adding location: ${error.message || 'Unknown error'}`);
    }
  };

  // NEW: Handler with confirmation dialog for deleting
  const handleDelete = async (locationId) => {
    // This will open a native browser popup: "Are you sure...?"
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        // Only if the user clicks "OK", we proceed to call removeLocation
        await removeLocation(locationId);
      } catch (error) {
        alert(`Failed to delete location: ${error.message}`);
      }
    }
  };
  
  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({ name: '', country_id: '', description: '', lat: null, lng: null });
    if (onLocationAdded) onLocationAdded();
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Locations ({locations.length})
        </h3>
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {showAddForm && (
        <form onSubmit={handleAddLocation} className="mb-3 space-y-3 p-3 bg-white rounded border">
          <input
            type="text"
            placeholder="Location name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded text-sm"
            required
          />
          <select
            value={formData.country_id}
            onChange={(e) => setFormData(prev => ({ ...prev, country_id: e.target.value }))}
            className="w-full p-2 border rounded text-sm"
            required
          >
            <option value="" disabled>-- Select a Country --</option>
            {countries.map(c => (
              <option key={c.country_id} value={c.country_id}>
                {c.country}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded text-sm"
            rows="2"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1">Add Location</Button>
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
          </div>
        </form>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {loading.locations ? (
          <div className="text-center">Loading locations...</div>
        ) : locations.length === 0 ? (
          <div className="text-center">No locations added yet.</div>
        ) : (
          <div className="space-y-2">
            {locations.map(location => (
              <div key={location.location_id} className="bg-white p-3 rounded border shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{location.loc_name}</h4>
                    <p className="text-sm text-gray-600">
                      {countryMap[location.country_id] || 'Unknown Country'}
                    </p>
                  </div>
                  {/* CORRECTED: onClick now calls the new handler */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(location.location_id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Locations;