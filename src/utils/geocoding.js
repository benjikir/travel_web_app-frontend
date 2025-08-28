// Get country from coordinates using reverse geocoding
export const getCountryFromCoordinates = async (lat, lng) => {
  try {
    // Using Nominatim OpenStreetMap reverse geocoding API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3`
    );
    const data = await response.json();
    
    if (data && data.address && data.address.country) {
      return data.address.country;
    }
    return null;
  } catch (error) {
    console.error("Error getting country from coordinates:", error);
    return null;
  }
};

// Find country ID by country name
export const findCountryIdByName = (countries, countryName) => {
  if (!countries || !countryName) return null;
  
  const country = countries.find(
    c => c.country.toLowerCase() === countryName.toLowerCase()
  );
  
  return country ? country.country_id : null;
};