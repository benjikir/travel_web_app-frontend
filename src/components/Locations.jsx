// src/components/Locations.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

function Locations({ travelData, mapLocation, onLocationAdded }) {
  const { locations, countries, loading, addLocation, removeLocation } = travelData;

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country_id: '',
    country_name: '',
    description: '',
    lat: '',
    lng: '',
    city: '',
    state: ''
  });

  const countryMap = React.useMemo(() => {
    if (!countries || countries.length === 0) return {};
    return countries.reduce((acc, c) => {
      acc[c.country_id] = c.country;
      return acc;
    }, {});
  }, [countries]);

  // ✅ Dies ist der finale, korrigierte useEffect
  useEffect(() => {
    // Schritt 1: Das Formular wird immer angezeigt, sobald ein Klick erfolgt.
    if (mapLocation) {
      let foundCountryId = ''; // Standardmäßig ist die ID leer.
      console.log("mapLocation geändert:", travelData, mapLocation);
      // Schritt 2: Wir versuchen den Abgleich NUR, wenn die Länderliste bereits geladen ist.
      if (countries && countries.length > 0) {
        const nameFromApi = mapLocation.country_name?.toLowerCase() || 'LEER';

        // --- WICHTIGE DIAGNOSE-AUSGABE ---
        console.log("--- Locations.jsx: Abgleich der Länder ---");
        console.log(`API liefert: "${nameFromApi}"`);
        console.log("DB enthält (Beispiele):", countries.slice(0, 5).map(c => c.country.toLowerCase()));
        
        const countryFound = countries.find(
          c => c.country.toLowerCase() === nameFromApi
        );

        if (countryFound) {
          console.log(`ERFOLG: ID ${countryFound.country_id} für "${nameFromApi}" gefunden.`);
          foundCountryId = countryFound.country_id;
        } else {
          console.error(`FEHLER: Der API-Name "${nameFromApi}" wurde in der Datenbank nicht gefunden.`);
        }
      } else {
        console.warn("Länderliste noch nicht geladen. 'country_id' kann nicht ermittelt werden.");
      }

      // Schritt 3: Wir füllen das Formular mit den Daten.
      setFormData({
        name: mapLocation.name || '',
        country_id: foundCountryId, // Wir verwenden die ID, die wir gefunden haben (oder leer).
        country_name: mapLocation.country_name || '', // Wir zeigen immer den Namen von der API an.
        description: mapLocation.description || '',
        lat: mapLocation.lat?.toFixed(6) || '',
        lng: mapLocation.lng?.toFixed(6) || '',
        city: mapLocation.city || '',
        state: mapLocation.state || ''
      });
      
      setShowAddForm(true); // Das Formular wird jetzt zuverlässig angezeigt.
    }
  }, [mapLocation, countries]);

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!formData.country_id) {
      alert('Could not auto-detect the country or country not in database. Please check the console logs for mismatches.');
      return;
    }
    try {
      await addLocation(formData);
      setShowAddForm(false);
      setFormData({ name: '', country_id: '', country_name: '', description: '', lat: '', lng: '', city: '', state: '' });
      if (onLocationAdded) onLocationAdded();
    } catch (error) {
      alert(`Error adding location: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await removeLocation(locationId);
      } catch (error) {
        alert(`Failed to delete location: ${error.message}`);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({ name: '', country_id: '', country_name: '', description: '', lat: '', lng: '', city: '', state: '' });
    if (onLocationAdded) onLocationAdded();
  };

  // --- Der Rest der Datei (JSX) bleibt unverändert ---
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
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className="w-full p-2 border rounded text-sm"
          />
          <input
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            className="w-full p-2 border rounded text-sm"
          />
          <input
            type="text"
            placeholder="Country"
            value={formData.country_name || ''}
            readOnly
            className="w-full p-2 border rounded text-sm bg-gray-100"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Latitude"
              value={formData.lat}
              readOnly
              className="w-1/2 p-2 border rounded text-sm bg-gray-100"
            />
            <input
              type="text"
              placeholder="Longitude"
              value={formData.lng}
              readOnly
              className="w-1/2 p-2 border rounded text-sm bg-gray-100"
            />
          </div>
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
                      {location.city ? ` • ${location.city}` : ''}
                      {location.state ? `, ${location.state}` : ''}
                    </p>
                  </div>
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