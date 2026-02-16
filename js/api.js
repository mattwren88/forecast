const API_BASE = 'https://api.weather.gov';
const HEADERS = {
  'User-Agent': '(forecast-app, github.com/forecast)',
  'Accept': 'application/geo+json'
};

export function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => reject(new Error(`Geolocation denied: ${err.message}`)),
      { timeout: 10000, maximumAge: 300000 }
    );
  });
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  return res.json();
}

export async function getGridPoint(lat, lon) {
  const data = await fetchJSON(`${API_BASE}/points/${lat.toFixed(4)},${lon.toFixed(4)}`);
  const props = data.properties;
  return {
    forecastUrl: props.forecast,
    forecastHourlyUrl: props.forecastHourly,
    observationStationsUrl: props.observationStations,
    gridId: props.gridId,
    gridX: props.gridX,
    gridY: props.gridY,
    city: props.relativeLocation?.properties?.city,
    state: props.relativeLocation?.properties?.state
  };
}

export async function getForecast(forecastUrl) {
  const data = await fetchJSON(forecastUrl);
  return data.properties.periods;
}

export async function getHourlyForecast(hourlyUrl) {
  const data = await fetchJSON(hourlyUrl);
  return data.properties.periods;
}

export async function getObservationStation(stationsUrl) {
  const data = await fetchJSON(stationsUrl);
  const stations = data.features;
  if (!stations || stations.length === 0) throw new Error('No observation stations found');
  return stations[0].properties.stationIdentifier;
}

export async function getCurrentObservation(stationId) {
  const data = await fetchJSON(`${API_BASE}/stations/${stationId}/observations/latest`);
  return data.properties;
}

export async function getAlerts(lat, lon) {
  const data = await fetchJSON(`${API_BASE}/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`);
  return data.features || [];
}
