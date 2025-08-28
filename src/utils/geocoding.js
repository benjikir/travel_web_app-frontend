// src/utils/geocoding.js
export const findCountryIdByName = (countries, countryName) => {
  if (!countries || !countryName) return null;
  const country = countries.find(
    c => c.country.toLowerCase() === countryName.toLowerCase()
  );
  return country ? country.country_id : null;
};

// Fallback mit OpenStreetMap/Nominatim, falls MapTiler keine Stadt/State liefert
const fallbackReverseGeocode = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`;
    const res = await fetch(url);
    if (!res.ok) return { city: '', state: '' };
    const data = await res.json();
    return {
      city: data.address.city || data.address.town || data.address.village || '',
      state: data.address.state || '',
    };
  } catch (err) {
    console.error("Fallback reverse geocode error:", err);
    return { city: '', state: '' };
  }
};

// Hauptfunktion: MapTiler + Fallback
export const reverseGeocodeWithCountryId = async (lat, lng, countries) => {
  try {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}&limit=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("MapTiler reverse geocode failed");

    const data = await response.json();
    const feature = data?.features?.[0];
    if (!feature) throw new Error("No features returned from MapTiler");

    const name = feature.properties?.name || '';
    const countryName = feature.properties?.country || '';
    let city = feature.properties?.city || '';
    let state = feature.properties?.state || '';
    const countryId = findCountryIdByName(countries, countryName);

    // Fallback, falls city oder state leer
    if (!city && !state) {
      const fallback = await fallbackReverseGeocode(lat, lng);
      city = fallback.city;
      state = fallback.state;
    }

    return {
      name,
      country_name: countryName,
      country_id: countryId || '',
      city,
      state,
      description: '',
      lat,
      lng,
    };
  } catch (error) {
    console.error("reverseGeocodeWithCountryId error:", error);
    return {
      name: '',
      country_name: '',
      country_id: '',
      city: '',
      state: '',
      description: '',
      lat,
      lng,
    };
  }
};
