// src/hooks/useTravelData.js
import { useState, useEffect } from "react";
import * as api from "../services/api.js";

export const useTravelData = (userId) => {
  const [data, setData] = useState({
    userCountries: [],
    trips: [],
    locations: [],
    users: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [userCountries, trips, locations, users] = await Promise.all([
          api.getUserCountries(userId),
          api.getTrips(userId),
          api.getAllLocations(),
          api.getUsers(),
        ]);

        setData({ userCountries, trips, locations, users });
      } catch (err) {
        console.error("Error loading travel data:", err);
        setError("Failed to load travel data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // CRUD functions for locations
  const addLocation = async (locationData) => {
    try {
      const newLocation = await api.addLocation(locationData);
      setData(prevData => ({
        ...prevData,
        locations: [...prevData.locations, newLocation]
      }));
      return newLocation;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  };

  const removeLocation = async (locationId) => {
    console.log('Deleting location_id:', locationId);
    try {
      await api.deleteLocation(locationId);
      setData(prevData => ({
        ...prevData,
        locations: prevData.locations.filter(
          location => location.location_id !== locationId
        )
      }));
    } catch (error) {
      console.error('Error removing location:', error);
      throw error;
    }
  };

  const updateLocation = async (locationId, locationData) => {
    try {
      const updatedLocation = await api.updateLocation(locationId, locationData);
      setData(prevData => ({
        ...prevData,
        locations: prevData.locations.map(location => 
          location.location_id === locationId ? updatedLocation : location
        )
      }));
      return updatedLocation;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  };

  // CRUD functions for trips
  const addTrip = async (tripData) => {
    try {
      const newTrip = await api.addTrip(tripData);
      setData(prevData => ({
        ...prevData,
        trips: [...prevData.trips, newTrip]
      }));
      return newTrip;
    } catch (error) {
      console.error('Error adding trip:', error);
      throw error;
    }
  };

  const removeTrip = async (tripId) => {
    try {
      await api.deleteTrip(tripId);
      setData(prevData => ({
        ...prevData,
        trips: prevData.trips.filter(trip => trip.id !== tripId)
      }));
    } catch (error) {
      console.error('Error removing trip:', error);
      throw error;
    }
  };

  const updateTrip = async (tripId, tripData) => {
    try {
      const updatedTrip = await api.updateTrip(tripId, tripData);
      setData(prevData => ({
        ...prevData,
        trips: prevData.trips.map(trip => 
          trip.id === tripId ? updatedTrip : trip
        )
      }));
      return updatedTrip;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  };

  // CRUD functions for user countries
  const addUserCountry = async (countryData) => {
    try {
      const newUserCountry = await api.addUserCountry(countryData);
      setData(prevData => ({
        ...prevData,
        userCountries: [...prevData.userCountries, newUserCountry]
      }));
      return newUserCountry;
    } catch (error) {
      console.error('Error adding user country:', error);
      throw error;
    }
  };

  const removeUserCountry = async (userId, countryId) => {
    try {
      await api.deleteUserCountry(userId, countryId);
      setData(prevData => ({
        ...prevData,
        userCountries: prevData.userCountries.filter(
          uc => !(uc.user_id === userId && uc.country_id === countryId)
        )
      }));
    } catch (error) {
      console.error('Error removing user country:', error);
      throw error;
    }
  };

  return { 
    ...data, 
    loading: { 
      locations: loading,
      trips: loading,
      userCountries: loading,
      users: loading
    }, 
    error,
    // Location CRUD functions
    addLocation,
    removeLocation,
    updateLocation,
    // Trip CRUD functions
    addTrip,
    removeTrip,
    updateTrip,
    // User Country CRUD functions
    addUserCountry,
    removeUserCountry
  };
};
