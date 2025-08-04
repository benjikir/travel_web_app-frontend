// src/hooks/useTravelData.js
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useTravelData = (userId = 1) => {
  const [userCountries, setUserCountries] = useState([]);
  const [trips, setTrips] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    countries: 0,
    trips: 0,
    locations: 0
  });
  const [loading, setLoading] = useState({
    userCountries: false,
    trips: false,
    locations: false,
    users: false,
    stats: false
  });
  const [error, setError] = useState(null);

  // Helper function to update loading state
  const setLoadingState = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  // Set current user and update API service
  useEffect(() => {
    if (userId) {
      apiService.setCurrentUser(userId);
    }
  }, [userId]);

  // User Countries (visited countries)
  const loadUserCountries = useCallback(async () => {
    setLoadingState('userCountries', true);
    setError(null);
    
    try {
      const data = await apiService.getUserCountries(userId);
      setUserCountries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Error loading countries: ${err.message}`);
      console.error('Error loading user countries:', err);
      setUserCountries([]);
    } finally {
      setLoadingState('userCountries', false);
    }
  }, [userId]);

  const addUserCountry = useCallback(async (countryData) => {
    try {
      const newCountry = await apiService.addUserCountry(countryData);
      setUserCountries(prev => [...prev, newCountry]);
      await loadStats(); // Update stats
      return newCountry;
    } catch (err) {
      setError(`Error adding country: ${err.message}`);
      throw err;
    }
  }, []);

  const updateUserCountry = useCallback(async (userCountryId, updateData) => {
    try {
      const updatedCountry = await apiService.updateUserCountry(userCountryId, updateData);
      setUserCountries(prev => 
        prev.map(country => 
          country.id === userCountryId ? updatedCountry : country
        )
      );
      return updatedCountry;
    } catch (err) {
      setError(`Error updating country: ${err.message}`);
      throw err;
    }
  }, []);

  const removeUserCountry = useCallback(async (userCountryId) => {
    try {
      await apiService.deleteUserCountry(userCountryId);
      setUserCountries(prev => prev.filter(country => country.id !== userCountryId));
      await loadStats(); // Update stats
    } catch (err) {
      setError(`Error deleting country: ${err.message}`);
      throw err;
    }
  }, []);

  // Trips
  const loadTrips = useCallback(async () => {
    setLoadingState('trips', true);
    setError(null);
    
    try {
      const data = await apiService.getTrips(userId);
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Error loading trips: ${err.message}`);
      console.error('Error loading trips:', err);
      setTrips([]);
    } finally {
      setLoadingState('trips', false);
    }
  }, [userId]);

  const addTrip = useCallback(async (tripData) => {
    try {
      const newTrip = await apiService.addTrip(tripData);
      setTrips(prev => [newTrip, ...prev]);
      await loadStats(); // Update stats
      return newTrip;
    } catch (err) {
      setError(`Error adding trip: ${err.message}`);
      throw err;
    }
  }, []);

  const updateTrip = useCallback(async (tripId, tripData) => {
    try {
      const updatedTrip = await apiService.updateTrip(tripId, tripData);
      setTrips(prev => 
        prev.map(trip => 
          trip.id === tripId ? updatedTrip : trip
        )
      );
      return updatedTrip;
    } catch (err) {
      setError(`Error updating trip: ${err.message}`);
      throw err;
    }
  }, []);

  const removeTrip = useCallback(async (tripId) => {
    try {
      await apiService.deleteTrip(tripId);
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      await loadStats();
    } catch (err) {
      setError(`Error deleting trip: ${err.message}`);
      throw err;
    }
  }, []);

  // Locations
  const loadLocations = useCallback(async () => {
    setLoadingState('locations', true);
    setError(null);
    
    try {
      const data = await apiService.getLocations();
      setLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Error loading locations: ${err.message}`);
      console.error('Error loading locations:', err);
      setLocations([]);
    } finally {
      setLoadingState('locations', false);
    }
  }, []);

  const addLocation = useCallback(async (locationData) => {
    try {
      const newLocation = await apiService.addLocation(locationData);
      setLocations(prev => [...prev, newLocation]);
      await loadStats(); // Update stats
      return newLocation;
    } catch (err) {
      setError(`Error adding location: ${err.message}`);
      throw err;
    }
  }, []);

  const updateLocation = useCallback(async (locationId, locationData) => {
    try {
      const updatedLocation = await apiService.updateLocation(locationId, locationData);
      setLocations(prev => 
        prev.map(location => 
          location.id === locationId ? updatedLocation : location
        )
      );
      return updatedLocation;
    } catch (err) {
      setError(`Error updating location: ${err.message}`);
      throw err;
    }
  }, []);

  const removeLocation = useCallback(async (locationId) => {
    try {
      await apiService.deleteLocation(locationId);
      setLocations(prev => prev.filter(location => location.id !== locationId));
      await loadStats();
    } catch (err) {
      setError(`Error deleting location: ${err.message}`);
      throw err;
    }
  }, []);

  // Users
  const loadUsers = useCallback(async () => {
    setLoadingState('users', true);
    
    try {
      const data = await apiService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
      
      // Set current user if not set
      if (!currentUser && data.length > 0) {
        const user = data.find(u => u.user_id === userId) || data[0];
        setCurrentUser(user);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setUsers([]);
    } finally {
      setLoadingState('users', false);
    }
  }, [userId, currentUser]);

  // Stats
  const loadStats = useCallback(async () => {
    setLoadingState('stats', true);
    
    try {
      const data = await apiService.getStats(userId);
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoadingState('stats', false);
    }
  }, [userId]);

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        loadUserCountries(),
        loadTrips(),
        loadLocations(),
        loadUsers(),
        loadStats()
      ]);
    };

    loadAllData();
  }, [loadUserCountries, loadTrips, loadLocations, loadUsers, loadStats]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    // Data
    userCountries, // Die Länder die der User besucht hat
    trips,
    locations,
    users,
    currentUser,
    stats,
    
    // Loading states
    loading,
    error,
    
    // Country actions
    addUserCountry,
    updateUserCountry,
    removeUserCountry,
    
    // Trip actions
    addTrip,
    updateTrip,
    removeTrip,
    
    // Location actions
    addLocation,
    updateLocation,
    removeLocation,
    
    // Refresh functions
    refreshUserCountries: loadUserCountries,
    refreshTrips: loadTrips,
    refreshLocations: loadLocations,
    refreshUsers: loadUsers,
    refreshStats: loadStats,
    
    // User management
    setCurrentUser: (user) => {
      setCurrentUser(user);
      if (user?.user_id) {
        apiService.setCurrentUser(user.user_id);
      }
    }
  };
};