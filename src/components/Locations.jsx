// src/components/Locations.jsx
import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AddLocationForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    country_id: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAdd({
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        country_id: formData.country_id ? parseInt(formData.country_id) : null
      });
      setFormData({ name: '', latitude: '', longitude: '', country_id: '', description: '' });
      onCancel();
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-white rounded border">
      <input
        type="text"
        placeholder="Location name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        className="w-full p-2 border rounded text-sm"
        required
      />
      
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
          className="p-2 border rounded text-sm"
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
          className="p-2 border rounded text-sm"
        />
      </div>

      <input
        type="number"
        placeholder="Country ID (optional)"
        value={formData.country_id}
        onChange={(e) => setFormData(prev => ({ ...prev, country_id: e.target.value }))}
        className="w-full p-2 border rounded text-sm"
      />

      <textarea
        placeholder="Description (optional)"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        className="w-full p-2 border rounded text-sm"
        rows="2"
      />

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Add Location
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

function Locations({ travelData }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const { locations, loading, addLocation, removeLocation } = travelData;

  const handleDelete = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await removeLocation(locationId);
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Locations ({locations.length})
        </h3>
        <Button 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading.locations}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-3">
          <AddLocationForm
            onAdd={addLocation}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loading.locations ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-blue-600">Loading locations...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-blue-600">No locations added yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {locations.map(location => (
              <div key={location.id} className="bg-white p-3 rounded border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{location.name}</h4>
                    {location.country_id && (
                      <p className="text-sm text-gray-600">Country ID: {location.country_id}</p>
                    )}
                    {(location.latitude && location.longitude) && (
                      <p className="text-xs text-gray-500">
                        {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </p>
                    )}
                    {location.description && (
                      <p className="text-sm text-gray-700 mt-1">{location.description}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(location.id)}
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