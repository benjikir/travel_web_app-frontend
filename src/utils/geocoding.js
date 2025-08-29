// src/utils/geocoding.js

// Fallback: Erzwingt jetzt ebenfalls Englisch mit `accept-language=en`
const fallbackReverseGeocode = async (lat, lng) => {
  try {
    console.log("--> Führe Fallback zu Nominatim aus (erzwinge Englisch)...");
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=en`;
    const res = await fetch(url);
    if (!res.ok) return { city: '', state: '', country: '' };
    const data = await res.json();
    return {
      city: data.address.city || data.address.town || data.address.village || '',
      state: data.address.state || '',
      country: data.address.country || ''
    };
  } catch (err) {
    console.error("Fallback reverse geocode error:", err);
    return { city: '', state: '', country: '' };
  }
};

// Hauptfunktion: Erzwingt Englisch bei MapTiler
export const reverseGeocode = async (lat, lng) => {
  try {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}&limit=1&language=en`;
    const response = await fetch(url, { cache: 'no-store' }); // Deaktiviert explizit Caching für diese Anfrage

    if (!response.ok) throw new Error("MapTiler reverse geocode failed");

    const data = await response.json();
    const feature = data?.features?.[0];
    if (!feature) throw new Error("No features returned from MapTiler");

    let countryName = feature.properties?.country || '';
    let city = feature.properties?.city || '';
    let state = feature.properties?.state || '';

    if (!countryName) {
      const fallback = await fallbackReverseGeocode(lat, lng);
      countryName = fallback.country;
      city = city || fallback.city;
      state = state || fallback.state;
    }
    
    return {
      name: feature.properties?.name || '',
      country_name: countryName,
      city,
      state,
      lat,
      lng,
    };

  } catch (error) {
    console.error("reverseGeocode error:", error);
    return { lat, lng, country_name: '', city: '', state: '', name: '' };
  }
};