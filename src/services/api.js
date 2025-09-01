import axios from "axios";

const API_URL = import.meta.env.DEV 
  ? '/api'  // This will be proxied to your Render URL
  : import.meta.env.VITE_API_URL || 'https://travelweb-app.onrender.com';

console.log('API_URL:', API_URL, 'DEV mode:', import.meta.env.DEV);

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

let currentUserId = null;

export const setCurrentUser = (userId) => {
  currentUserId = userId;
};

export const getUserCountries = async (userId = currentUserId) => {
  if (!userId) throw new Error("User ID is required");

  // This endpoint *does* use a trailing slash on your backend
  const res = await api.get('/locations/');

  const locations = Array.isArray(res.data) ? res.data : [];

  // Only this user's locations + ignore null/undefined country_id
  const ids = new Set(
    locations
      .filter(l => Number(l?.user_id) === Number(userId) && l?.country_id != null)
      .map(l => l.country_id)
  );

  // Return the number of unique countries
  return ids.size;
};

export const addUserCountry = async (countryData) => {
  if (!currentUserId) throw new Error("No user currently set");
  const res = await api.post(`/user-countries/`, { ...countryData, user_id: currentUserId });
  return res.data;
};

export const deleteUserCountry = async (userId, countryId) => {
  await api.delete(`/user-countries/${userId}/${countryId}`);
};

// -------- TRIPS ----------
export const getTrips = async (userId = currentUserId) => {
  if (!userId) throw new Error("User ID is required");
  // Add trailing slash to path to prevent 308 redirect
  const res = await api.get(`/trips/?user_id=${userId}`);
  return res.data;
};

export const getTrip = async (tripId) => {
  const res = await api.get(`/trips/${tripId}/`);
  return res.data;
};

export const addTrip = async (tripData) => {
  if (!currentUserId) {
    console.error("currentUserId is not set:", currentUserId);
    throw new Error("No user currently set");
  }
  
  if (!tripData.name) {
    console.error("tripData.name is missing:", tripData);
    throw new Error("Trip name is required");
  }
  
  if (!tripData.country_id) {
    console.error("tripData.country_id is missing:", tripData);
    throw new Error("Country ID is required");
  }
  
  // Ensure the payload EXACTLY matches the backend model
  const payload = {
    trip_name: tripData.name, // The key MUST be 'trip_name'
    user_id: currentUserId,
    start_date: tripData.start_date || null,  // Fixed: no underscore
    end_date: tripData.end_date || null,    // Fixed: no underscore
    country_id: Number(tripData.country_id),
  };
  
  console.log("Sending payload:", payload); // Log the payload for debugging
  
  try {
    const res = await api.post("/trips/", payload); // Slashed path
    return res.data;
  } catch (e) {
    console.error("addTrip failed:", e?.response?.status, e?.response?.data || e.message);
    throw e;
  }
};


export const updateTrip = async (tripId, tripData) => {
  const payload = {
    trip_name: tripData.name,
    startdate: tripData.start_date,  // Fixed: no underscore
    enddate: tripData.end_date,      // Fixed: no underscore
    country_id: tripData.country_id,
    location_id: tripData.location_id || null,
    notes: tripData.notes || ''
  };
  
  const res = await api.put(`/trips/${tripId}/`, payload);
  return res.data;
};

export const deleteTrip = async (tripId) => {
  // Add trailing slash
  await api.delete(`/trips/${tripId}/`);
};

// -------- LOCATIONS ----------
export const getAllLocations = async () => {
  // Add trailing slash
  const res = await api.get("/locations/");
  return res.data;
};

export const getLocation = async (locationId) => {
  const res = await api.get(`/locations/${locationId}/`);
  return res.data;
};

export const addLocation = async (locationData) => {
  if (!currentUserId) throw new Error("currentUserId is not set.");
  
  // Validate required fields
  if (!locationData.name) {
    throw new Error("Location name is required");
  }
  
  if (!locationData.country_id) {
    throw new Error("Country ID is required");
  }
  
  const payload = {
    loc_name: locationData.name,
    user_id: Number(currentUserId),
    country_id: Number(locationData.country_id),
    // Add coordinates if they exist
    ...(locationData.lat !== undefined && { lat: locationData.lat }),
    ...(locationData.lng !== undefined && { lng: locationData.lng }),
    description: locationData.description || null
  };
  
  try {
    const res = await api.post("/locations/", payload); // Slashed path
    return res.data;
  } catch (e) {
    console.error("addLocation failed:", e?.response?.status, e?.response?.data || e.message);
    throw e;
  }
};

export const updateLocation = async (locationId, locationData) => {
  const payload = {
    loc_name: locationData.name,
    country_id: Number(locationData.country_id),
    ...(locationData.lat !== undefined && { lat: locationData.lat }),
    ...(locationData.lng !== undefined && { lng: locationData.lng }),
    description: locationData.description || null
  };
  
  const res = await api.put(`/locations/${locationId}/`, payload);
  return res.data;
};

export const deleteLocation = async (locationId) => {
  console.log("Deleting location with ID:", locationId);
  if (!locationId) throw new Error("deleteLocation requires a valid locationId");
  // Add trailing slash
  const res = await api.delete(`/locations/${locationId}`);
  return res.data;
};

// -------- USERS ----------
export const getUsers = async () => {
  const res = await api.get("/users/"); // Slashed path
  return res.data;
};

export const getUser = async (userId) => {
  const res = await api.get(`/users/${userId}/`);
  return res.data;
};

export const createUser = async (userData) => {
  const res = await api.post("/users/", userData);
  return res.data;
};

export const updateUser = async (userId, userData) => {
  const res = await api.put(`/users/${userId}/`, userData);
  return res.data;
};

export const deleteUser = async (userId) => {
  await api.delete(`/users/${userId}/`);
};

// -------- COUNTRIES ----------
export const getCountries = async () => {
  const res = await api.get("/countries/"); // Slashed path
  return res.data;
};

export const getCountry = async (countryId) => {
  const res = await api.get(`/countries/${countryId}/`);
  return res.data;
};