const TIMEZONEDB_API_KEY = "YOUR_TIMEZONEDB_API_KEY"; // replace this

let lltimezoneCache = ""; // Your cache variable

async function getTimezoneOffset(lat, lon, date = new Date()) {
  try {
    // First: Try GeoTimeZone
    const geoOffset = await tryGeoTimeZone(lat, lon);
    if (geoOffset !== null) return geoOffset;

    // Fallback: Try TimeZoneDB with timestamp
    const fallbackOffset = await tryTimeZoneDB(lat, lon, date);
    return fallbackOffset;
  } catch (error) {
    console.error("Final fallback error:", error);
    return 0;
  }
}

// GeoTimeZone (primary)
async function tryGeoTimeZone(lat, lon) {
  try {
    const url = `https://api.geotimezone.com/public/timezone?latitude=${lat}&longitude=${lon}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("GeoTimeZone failed");

    const data = await response.json();

    const offsetSeconds = data.offset?.total_seconds;
    if (offsetSeconds === undefined)
      throw new Error("Invalid GeoTimeZone data");

    const offsetHours = offsetSeconds / 3600;
    cacheOffset(lat, lon, offsetHours);

    return offsetHours;
  } catch (error) {
    console.warn("GeoTimeZone error:", error.message);
    return null;
  }
}

// TimeZoneDB (fallback)
async function tryTimeZoneDB(lat, lon, date) {
  try {
    const timestamp = Math.floor(date.getTime() / 1000);
    const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONEDB_API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}&time=${timestamp}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") throw new Error("TimeZoneDB API error");

    const offsetHours = (data.gmtOffset || 0) / 3600;
    cacheOffset(lat, lon, offsetHours);

    return offsetHours;
  } catch (error) {
    console.error("TimeZoneDB fallback error:", error.message);
    return 0;
  }
}

// Cache helper (simulate what you do in your code)
function cacheOffset(lat, lon, offsetHours) {
  const cacheKey = `${lat.toString().substring(0, 6)},${lon.toString().substring(0, 6)},${offsetHours};`;
  lltimezoneCache += cacheKey;
}

const lat = 40.7128;
const lon = -74.006;
const specificDate = new Date("2024-12-01T12:00:00Z");

getTimezoneOffset(lat, lon, specificDate).then((offset) => {
  console.log("Final timezone offset in hours:", offset);
});
