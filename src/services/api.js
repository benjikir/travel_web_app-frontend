// src/services/api.js

const API_BASE_URL = 'http://localhost:5001'; // Dein Flask-App Port

class ApiService {
  constructor() {
    this.defaultUserId = 1; // Standard-User ID, kann später dynamisch werden
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Users API
  async getUsers() {
    return this.request('/users');
  }

  async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // User Countries API (die Länder die ein User besucht hat)
  async getUserCountries(userId = this.defaultUserId) {
    return this.request(`/user-countries?user_id=${userId}`);
  }

  async addUserCountry(countryData) {
    return this.request('/user-countries', {
      method: 'POST',
      body: JSON.stringify({
        user_id: this.defaultUserId,
        ...countryData,
      }),
    });
  }

  async updateUserCountry(userCountryId, updateData) {
    return this.request(`/user-countries/${userCountryId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteUserCountry(userCountryId) {
    return this.request(`/user-countries/${userCountryId}`, {
      method: 'DELETE',
    });
  }

  // Locations API
  async getLocations() {
    return this.request('/locations');
  }

  async getLocationsByCountry(countryId) {
    return this.request(`/locations?country_id=${countryId}`);
  }

  async addLocation(locationData) {
    return this.request('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

  async updateLocation(locationId, locationData) {
    return this.request(`/locations/${locationId}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
  }

  async deleteLocation(locationId) {
    return this.request(`/locations/${locationId}`, {
      method: 'DELETE',
    });
  }

  // Trips API
  async getTrips(userId = this.defaultUserId) {
    return this.request(`/trips?user_id=${userId}`);
  }

  async getTrip(tripId) {
    return this.request(`/trips/${tripId}`);
  }

  async addTrip(tripData) {
    return this.request('/trips', {
      method: 'POST',
      body: JSON.stringify({
        user_id: this.defaultUserId,
        ...tripData,
      }),
    });
  }

  async updateTrip(tripId, tripData) {
    return this.request(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  }

  async deleteTrip(tripId) {
    return this.request(`/trips/${tripId}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  async getStats(userId = this.defaultUserId) {
    try {
      const [userCountries, trips, locations] = await Promise.all([
        this.getUserCountries(userId),
        this.getTrips(userId),
        this.getLocations()
      ]);

      return {
        countries: userCountries.length || 0,
        trips: trips.length || 0,
        locations: locations.length || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { countries: 0, trips: 0, locations: 0 };
    }
  }

  // Set current user (für spätere Authentifizierung)
  setCurrentUser(userId) {
    this.defaultUserId = userId;
  }
}

// Singleton instance
const apiService = new ApiService();
export default apiService;