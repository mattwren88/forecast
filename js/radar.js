let map = null;

export function initRadar(lat, lon) {
  if (map) {
    map.setView([lat, lon], 8);
    return;
  }

  map = L.map('radar-map', {
    zoomControl: true,
    attributionControl: false
  }).setView([lat, lon], 8);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 12,
    attribution: '\u00A9 OpenStreetMap'
  }).addTo(map);

  loadRadarOverlay();

  L.circleMarker([lat, lon], {
    radius: 6,
    fillColor: '#4a90d9',
    fillOpacity: 0.9,
    color: '#fff',
    weight: 2
  }).addTo(map);
}

async function loadRadarOverlay() {
  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
    const data = await res.json();
    const latestRadar = data.radar?.past?.slice(-1)[0];
    if (latestRadar) {
      L.tileLayer(`https://tilecache.rainviewer.com${latestRadar.path}/256/{z}/{x}/{y}/2/1_1.png`, {
        opacity: 0.5,
        maxZoom: 12
      }).addTo(map);
    }
  } catch {
    // Radar overlay failed silently - base map still works
  }
}
