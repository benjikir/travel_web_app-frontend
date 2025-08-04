// src/components/Trips.jsx
import React, { useState } from 'react';
import { Plane, Plus, Calendar, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AddTripForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    destination: '',
    budget: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAdd({
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null
      });
      setFormData({ title: '', description: '', start_date: '', end_date: '', destination: '', budget: '' });
      onCancel();
    } catch (error) {
      console.error('Error adding trip:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-white rounded border">
      <input
        type="text"
        placeholder="Trip title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        className="w-full p-2 border rounded text-sm"
        required
      />
      
      <input
        type="text"
        placeholder="Destination"
        value={formData.destination}
        onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
        className="w-full p-2 border rounded text-sm"
      />

      <textarea
        placeholder="Description (optional)"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        className="w-full p-2 border rounded text-sm"
        rows="2"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          placeholder="Start date"
          value={formData.start_date}
          onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
          className="p-2 border rounded text-sm"
        />
        <input
          type="date"
          placeholder="End date"
          value={formData.end_date}
          onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
          className="p-2 border rounded text-sm"
        />
      </div>

      <input
        type="number"
        step="0.01"
        placeholder="Budget (optional)"
        value={formData.budget}
        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
        className="w-full p-2 border rounded text-sm"
      />

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Add Trip
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

function Trips({ travelData }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const { trips, loading, addTrip, removeTrip } = travelData;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleDelete = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await removeTrip(tripId);
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  return (
    <div className="bg-amber-50 p-4 rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-green-800 flex items-center">
          <Plane className="h-5 w-5 mr-2" />
          Trips ({trips.length})
        </h3>
        <Button 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading.trips}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-3">
          <AddTripForm
            onAdd={addTrip}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loading.trips ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-green-600">Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-green-600">No trips planned yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {trips.map(trip => (
              <div key={trip.id} className="bg-white p-3 rounded border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{trip.title}</h4>
                    {trip.destination && (
                      <p className="text-sm text-gray-600">{trip.destination}</p>
                    )}
                    {(trip.start_date || trip.end_date) && (
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {trip.start_date && formatDate(trip.start_date)}
                        {trip.start_date && trip.end_date && ' - '}
                        {trip.end_date && formatDate(trip.end_date)}
                      </p>
                    )}
                    {trip.budget && (
                      <p className="text-sm text-green-600 font-medium">
                        Budget: {formatCurrency(trip.budget)}
                      </p>
                    )}
                    {trip.description && (
                      <p className="text-sm text-gray-700 mt-1">{trip.description}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(trip.id)}
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