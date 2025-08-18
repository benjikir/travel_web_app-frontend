// src/services/apiService.js
import axios from "axios";

// API-URL aus Vite env
const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let currentUserId = null;

// Aktuellen User setzen
export const setCurrentUser = (userId) => {
  currentUserId = userId;
};

// -------- USER COUNTRIES ----------
export const getUserCountries = async (userId = currentUserId) => {
  const res = await api.get(`/user-countries/${userId}`); // Corrected: Use /user-countries/:userId
  return res.data;
};


export const addUserCountry = async (countryData) => {
  const res = await api.post(`/user-countries`, { ...countryData, userId: currentUserId });
  return res.data;
};

export const deleteUserCountry = async (userId, countryId) => {
  // Corrected DELETE route
  await api.delete(`/user-countries/${userId}/${countryId}`);
};

// -------- TRIPS ----------

export const getTrips = async (userId = currentUserId) => {
  const res = await api.get(`/trips?userId=${userId}`); // This is correct
  return res.data;
};


export const getTrip = async (tripId) => {
  const res = await api.get(`/trips/${tripId}`); //  <---- ADD THIS
  return res.data;
};

export const addTrip = async (tripData) => {
  const res = await api.post(`/trips`, { ...tripData, userId: currentUserId });
  return res.data;
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

export const getLocations = async (locationId) => { // <---- Hinzufügen
  const res = await api.get(`/locations/${locationId}`);
  return res.data;
};

export const addLocation = async (locationData) => {
  const res = await api.post(`/locations`, locationData);
  return res.data;
};

export const updateLocation = async (locationId, locationData) => {
  const res = await api.put(`/locations/${locationId}`, locationData);
  return res.data;
};

export const deleteLocation = async (locationId) => {
  await api.delete(`/locations/${locationId}`);
};

// -------- USERS ----------
export const getUsers = async () => {
    const res = await api.get(`/users`);
    return res.data;
  };

export const getUser = async (userId) => {  // <---- ADD THIS FUNCTION
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

console.log();
  