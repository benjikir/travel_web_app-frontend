// src/services/api.js
import axios from "axios";

// Use proxy in development, direct URL in production
const API_URL = import.meta.env.DEV 
  ? '/api'  // This will be proxied to your Render URL
  : import.meta.env.VITE_API_URL || 'https://travelweb-app.onrender.com';

console.log('API_URL:', API_URL, 'DEV mode:', import.meta.env.DEV);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});


// Aktuellen User setzen
export const setCurrentUser = (userId) => {
  setCurrentUser = userId;
};

// -------- USER COUNTRIES ----------
export const getUserCountries = async (userId = currentUserId) => {
  const res = await api.get(`/user-countries/${userId}`);
  return res.data;
};

export const addUserCountry = async (countryData) => {
  const res = await api.post(`/user-countries`, { ...countryData, userId: currentUserId });
  return res.data;
};

export const deleteUserCountry = async (userId, countryId) => {
  await api.delete(`/user-countries/${userId}/${countryId}`);
};

// -------- TRIPS ----------
export const getTrips = async (userId = currentUserId) => {
  const res = await api.get(`/trips?userId=${userId}`);
  return res.data;
};

export const getTrip = async (tripId) => {
  const res = await api.get(`/trips/${tripId}`);
  return res.data;
};

export const addTrip = async (tripData) => {
console.log('Adding trip:', tripData);
  try { 
const res = await api.post(`/trips`, {
    trip_name: tripData.name,
    user_id: currentUserId,
    start_date: tripData.start_date,
    end_date: tripData.end_date,
    country_id: tripData.country_id,
  });
    return res.data;
  } catch (e) {
    console.error("addTrip failed:", e?.response?.status, e?.response?.data || e.message);
    throw e;
  }
};


export const updateTrip = async (tripId, tripData) => {
  const res = await api.put(`/trips/${tripId}`, tripData);
  return res.data;
};

export const deleteTrip = async (tripId) => {
  await api.delete(`/trips/${tripId}`);
};

// -------- LOCATIONS ----------
export const getAllLocations = async () => {
  const res = await api.get(`/locations`);
  return res.data;
};

export const getLocations = async (locationId) => {
  const res = await api.get(`/locations/${locationId}`);
  return res.data;
};

export const addLocation = async (locationData) => {
  console.log('Adding location:', locationData);
  try {
    const res = await api.post("/locations", {
      loc_name: locationData.name, 
      user_id: 1,
      country_id: locationData.country_id
    });
    return res.data;
  } catch (e) {
    console.error("addLocation failed:", e?.response?.status, e?.response?.data || e.message);
    throw e;
  }
};

export const deleteLocation = async (locationId) => {
  if (!locationId) throw new Error("deleteLocation requires a valid locationId");
  const res = await api.delete(`/locations/${locationId}`);
  return res.data;
};

export const updateLocation = async (locationId, locationData) => {
  const res = await api.put(`/locations/${locationId}`, locationData);
  return res.data;
};

// -------- USERS ----------
export const getUsers = async () => {
  const res = await api.get(`/users`);
  return res.data;
};

export const getUser = async (userId) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

export const createUser = async (userData) => {
  const res = await api.post(`/users`, userData);
  return res.data;
};

export const updateUser = async (userId, userData) => {
  const res = await api.put(`/users/${userId}`, userData);
  return res.data;
};

export const deleteUser = async (userId) => {
  await api.delete(`/users/${userId}`);
};  