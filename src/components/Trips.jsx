// src/components/Trips.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Plane, Plus, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

// Lokale Datumskonvertierung (ohne UTC-Shift) zu YYYY-MM-DD
const toYMD = (d) => {
  if (!(d instanceof Date)) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// --- KORRIGIERTES FORMULAR mit neuem Kalender ---
const AddTripForm = ({ countries, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',        // wie zuvor
    notes: '',       // wie zuvor
    start_date: '',  // ISO-String YYYY-MM-DD
    end_date: '',    // ISO-String YYYY-MM-DD
    country_id: '',  // Dropdown
  });

  // Range-Kalender-State
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  // Aus Kalenderauswahl in Formularfelder spiegeln
  useEffect(() => {
    const start = toYMD(dateRange?.from);
    const end = toYMD(dateRange?.to || dateRange?.from);
    setFormData((f) => ({ ...f, start_date: start || '', end_date: end || '' }));
  }, [dateRange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.country_id) {
      alert("Please select a country for your trip.");
      return;
    }
    try {
      await onAdd(formData);
      setFormData({ name: '', notes: '', start_date: '', end_date: '', country_id: '' });
      setDateRange({ from: undefined, to: undefined });
      onCancel();
    } catch (error) {
      console.error('Error adding trip:', error);
      alert(`Failed to add trip: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-white rounded border">
      <input
        type="text"
        placeholder="Trip name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        className="w-full p-2 border rounded text-sm"
        required
      />

      {/* --- NEUES LÄNDER-DROPDOWN --- */}
      <select
        value={formData.country_id}
        onChange={(e) => setFormData(prev => ({ ...prev, country_id: e.target.value }))}
        className="w-full p-2 border rounded text-sm"
        required
      >
        <option value="" disabled>-- Select a Country --</option>
        {(countries || []).map(c => (
          <option key={c.country_id} value={c.country_id}>{c.country}</option>
        ))}
      </select>

      <textarea
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        className="w-full p-2 border rounded text-sm"
        rows="2"
      />

      {/* --- NEUER RANGE-KALENDER statt 2x <input type="date" /> --- */}
      <div className="space-y-2">
        <label className="text-sm flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" /> Date range
        </label>
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          className="rounded-lg border shadow-sm"
        />
        <div className="text-xs text-muted-foreground">
          {formData.start_date
            ? `Start: ${formData.start_date}` + (formData.end_date ? ` • End: ${formData.end_date}` : '')
            : 'Pick at least a start date'}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" variant="outline" className="flex-1">Add Trip</Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

function Trips({ travelData }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const { trips, countries, loading, addTrip, removeTrip } = travelData;

  const countryMap = useMemo(() => {
    if (!countries) return {};
    return countries.reduce((acc, c) => {
      acc[c.country_id] = c.country;
      return acc;
    }, {});
  }, [countries]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString.replace(/-/g, '/')).toLocaleDateString('de-DE');
  };

  const handleDelete = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      await removeTrip(tripId);
    }
  };

  return (
    <div className="bg-amber-50 p-4 rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-green-800 flex items-center">
          <Plane className="h-5 w-5 mr-2" />
          Trips ({trips.length})
        </h3>
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-3">
          <AddTripForm
            countries={countries}
            onAdd={addTrip}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loading.trips ? (
          <p className="text-center text-green-600">Loading trips...</p>
        ) : trips.length === 0 ? (
          <p className="text-center text-green-600">No trips planned yet</p>
        ) : (
          <div className="space-y-2">
            {trips.map(trip => (
              <div key={trip.trip_id} className="bg-white p-3 rounded border shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    {/* Anzeige mit normalisierten Feldern aus Hook */}
                    <h4 className="font-medium text-gray-800">{trip.name || trip.trip_name}</h4>
                    <p className="text-sm text-gray-600">{countryMap[trip.country_id] || 'Unknown Country'}</p>

                    {(trip.start_date || trip.end_date || trip.startdate || trip.enddate) && (
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {formatDate(trip.start_date || trip.startdate)}
                        {(trip.start_date || trip.startdate) && (trip.end_date || trip.enddate) && ' - '}
                        {formatDate(trip.end_date || trip.enddate)}
                      </p>
                    )}

                    {trip.notes && (
                      <p className="text-sm text-gray-700 mt-1">{trip.notes}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(trip.trip_id)}
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

export default Trips;
