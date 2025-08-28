import { useState, useEffect } from "react";
import * as api from "@/services/api";

export const useTravelData = (userId) => {
  // State for holding all the fetched data
  const [data, setData] = useState({
    userCountries: [],
    trips: [],
    locations: [],
    users: [],
    countries: []
  });
  
  // Granular loading state for different actions
  const [loading, setLoading] = useState({
    // Initial data loading flags
    locations: true,
    trips: true,
    userCountries: true,
    users: true,
    countries: true,
    // Action-specific loading flags
    addLocation: false,
    removeLocation: false,
    updateLocation: false,
    addTrip: false,
    removeTrip: false,
    updateTrip: false,
  });
  
  // State for handling any errors
  const [error, setError] = useState(null);

  // =================================================================
  // VVVV --- THIS IS THE KEY FIX --- VVVV
  // =================================================================
  // This effect synchronizes the userId from the React component
  // with the api.js service module. It runs whenever the userId changes.
  useEffect(() => {
    if (userId) {
      api.setCurrentUser(userId);
    }
  }, [userId]);
  // =================================================================
  // ^^^^ --- END OF THE FIX --- ^^^^
  // =================================================================

  // This effect fetches all initial data when the component mounts or userId changes.
  useEffect(() => {
    if (!userId) {
      Object.keys(loading).forEach(key => setLoading(prev => ({ ...prev, [key]: false })));
      return;
    }
    
    const loadData = async () => {
      try {
        setLoading(prev => ({ ...prev, locations: true, trips: true, userCountries: true, users: true, countries: true }));
        
        const [userCountries, trips, locations, users, countries] = await Promise.all([
          api.getUserCountries(),
          api.getTrips(userId),
          api.getAllLocations(),
          api.getUsers(),
          api.getCountries() 
          
        ]);
        console.log("Load data" , userCountries,locations[locations.length - 1]) 
        setData({ userCountries, trips, locations, users, countries });
        setError(null);
      } catch (err) {
        console.error("Data loading failed:", err);
        setError(err.message || "Failed to load travel data");
      } finally {
        setLoading(prev => ({ ...prev, locations: false, trips: false, userCountries: false, users: false, countries: false }));
      }
    };
   
    loadData();
  }, [userId]);

  // --- Action Functions for Locations ---
  const addLocation = async (locationData) => {
    try {
      setLoading(prev => ({ ...prev, addLocation: true }));
      const newLocation = await api.addLocation(locationData);
      setData(prevData => ({
        ...prevData,
        locations: [...prevData.locations, newLocation].sort((a, b) => a.loc_name.localeCompare(b.loc_name))
      }));
      return newLocation;
    } catch (error) {
      console.error("Error adding location:", error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, addLocation: false }));
    }
  };

  const removeLocation = async (locationId) => {
    try {
      setLoading(prev => ({ ...prev, removeLocation: true }));
      await api.deleteLocation(locationId);
      setData(prevData => ({
        ...prevData,
        locations: prevData.locations.filter(loc => loc.location_id !== locationId)
      }));
    } catch (error) {
      console.error("Error removing location:", error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, removeLocation: false }));
    }
  };

  const updateLocation = async (locationId, locationData) => {
    try {
      setLoading(prev => ({ ...prev, updateLocation: true }));
      const updatedLocation = await api.updateLocation(locationId, locationData);
      setData(prevData => ({
        ...prevData,
        locations: prevData.locations.map(loc => 
          loc.location_id === locationId ? updatedLocation : loc
        )
      }));
      return updatedLocation;
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, updateLocation: false }));
    }
  };

  // --- Action Functions for Trips ---
  const addTrip = async (tripData) => {
    try {
      setLoading(prev => ({ ...prev, addTrip: true }));
      const newTrip = await api.addTrip(tripData);
      setData(prevData => ({ ...prevData, trips: [...prevData.trips, newTrip] }));
      return newTrip;
    } catch (error) {
      console.error("Error adding trip:", error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, addTrip: false }));
    }
  };

  const removeTrip = async (tripId) => {
    try {
      setLoading(prev => ({ ...prev, removeTrip: true }));
      await api.deleteTrip(tripId);
      setData(prevData => ({
        ...prevData,
        trips: prevData.trips.filter(trip => trip.trip_id !== tripId)
      }));
    } catch (error) {
      console.error("Error removing trip:", error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, removeTrip: false }));
    }
  };

  const updateTrip = async (tripId, tripData) => {
    try {
      setLoading(prev => ({ ...prev, updateTrip: true }));
      const updatedTrip = await api.updateTrip(tripId, tripData);
      setData(prevData => ({
        ...prevData,
        trips: prevData.trips.map(trip => 
          trip.trip_id === tripId ? updatedTrip : trip
        )
      }));
      return updatedTrip;
    } catch (error) {
      console.error("Error updating trip:", error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, updateTrip: false }));
    }
  };

  // The hook returns all data, loading states, errors, and action functions
  return {
    ...data,
    loading,
    error,
    addLocation,
    removeLocation,
    updateLocation,
    addTrip,
    removeTrip,
    updateTrip,
  };
};