import { useState, useEffect } from "react";
import * as apiService from "../services/api.js";

export const useTravelData = (userId) => {
  const [data, setData] = useState({
    userCountries: [],
    trips: [],
    locations: [],
    users: [],
  });
  const [loading, setLoading] = useState({
    userCountries: true,
    trips: true,
    locations: true,
    users: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userCountries, trips, locations, users] = await Promise.all([
          apiService.getUserCountries(userId),
          apiService.getTrips(userId),
          apiService.getAllLocations(), // Corrected: Use getAllLocations()
          apiService.getUsers(),
        ]);

        setData({ userCountries, trips, locations, users });
      } catch (err) {
        console.error("Error loading travel data:", err);
        setError("Failed to load travel data.");
      } finally {
        setLoading({
          userCountries: false,
          trips: false,
          locations: false,
          users: false,
        });
      }
    };

    fetchData();
  }, [userId]);

  return { ...data, loading, error };
};

console.log();
