// src/utils/geocoding.js

const fallbackReverseGeocode = async (lat, lng) => {
  try {
    console.log("--> Führe Fallback zu Nominatim aus (erzwinge Englisch)...");
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=en`;
    const res = await fetch(url);
    if (!res.ok) return { city: '', state: '', country: '', country_code: '' };
    
    const data = await res.json();
    return {
      city: data.address.city || data.address.town || data.address.village || '',
      state: data.address.state || '',
      country: data.address.country || '',
      country_code: data.address.country_code?.toUpperCase() || '' // ✅ ISO 2-letter Code
    };
  } catch (err) {
    console.error("Fallback reverse geocode error:", err);
    return { city: '', state: '', country: '', country_code: '' };
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}&limit=1&language=en`;
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) throw new Error("MapTiler reverse geocode failed");
    
    const data = await response.json();
    const feature = data?.features?.[0];
    
    if (!feature) throw new Error("No features returned from MapTiler");
    
    let countryName = feature.properties?.country || '';
    let countryCode = feature.properties?.country_code?.toUpperCase() || ''; // ✅ NEU!
    let city = feature.properties?.city || '';
    let state = feature.properties?.state || '';
    
    // Fallback falls nötig
    if (!countryName || !countryCode) {
      const fallback = await fallbackReverseGeocode(lat, lng);
      countryName = countryName || fallback.country;
      countryCode = countryCode || fallback.country_code; // ✅ NEU!
      city = city || fallback.city;
      state = state || fallback.state;
    }
    
    return {
      name: feature.properties?.name || '',
      country_name: countryName,
      country_code: countryCode, // ✅ NEU! 2-letter ISO code (z.B. "DE")
      city,
      state,
      lat,
      lng,
    };
  } catch (error) {
    console.error("reverseGeocode error:", error);
    return { lat, lng, country_name: '', country_code: '', city: '', state: '', name: '' };
  }
};
