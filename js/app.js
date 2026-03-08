import { getLocation, getGridPoint, getForecast, getHourlyForecast, getObservationStation, getCurrentObservation, getAlerts } from './api.js';
import { renderCurrentWeather, renderAlerts, showError } from './ui.js';
import { renderPillChart } from './pillchart.js';
import { renderHourlyChart } from './hourly.js';
import { initRadar } from './radar.js';

const $ = id => document.getElementById(id);

let chartMode = localStorage.getItem('chartMode') || 'horizontal';
let forecastPeriods = null;

const THEMES = {
  dawn:    { bg: 'linear-gradient(160deg, #fde8d0 0%, #fce4ec 50%, #e8d5c4 100%)', cardBg: 'rgba(255, 255, 255, 0.85)' },
  morning: { bg: 'linear-gradient(160deg, #e8f0fe 0%, #f5efe6 50%, #fce4ec 100%)', cardBg: 'rgba(255, 255, 255, 0.82)' },
  midday:  { bg: 'linear-gradient(160deg, #e8f4fd 0%, #f0f4f8 50%, #e8ecf0 100%)', cardBg: 'rgba(255, 255, 255, 0.88)' },
  evening: { bg: 'linear-gradient(160deg, #fce4d6 0%, #f5deb3 50%, #e8c9a8 100%)', cardBg: 'rgba(255, 255, 255, 0.82)' },
  dusk:    { bg: 'linear-gradient(160deg, #c9b8d4 0%, #a8a0c8 50%, #8888b0 100%)', cardBg: 'rgba(255, 255, 255, 0.75)', textPrimary: '#1a1a2e', textSecondary: '#4a4a6a', textTertiary: '#7878a0' },
  night:   { bg: 'linear-gradient(160deg, #1a1a3e 0%, #2a2a4e 50%, #1e2040 100%)', cardBg: 'rgba(30, 32, 60, 0.85)', textPrimary: '#e0e0f0', textSecondary: '#a0a0c0', textTertiary: '#7070a0' },
};

const DEFAULT_TEXT = { textPrimary: '#1a1a2e', textSecondary: '#5a5a7a', textTertiary: '#8888a8' };

function getThemeForHour(hour) {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 16) return 'midday';
  if (hour >= 16 && hour < 19) return 'evening';
  if (hour >= 19 && hour < 21) return 'dusk';
  return 'night';
}

function applyDynamicBackground() {
  const theme = { ...DEFAULT_TEXT, ...THEMES[getThemeForHour(new Date().getHours())] };
  const root = document.documentElement;
  root.style.setProperty('--card-bg', theme.cardBg);
  root.style.setProperty('--text-primary', theme.textPrimary);
  root.style.setProperty('--text-secondary', theme.textSecondary);
  root.style.setProperty('--text-tertiary', theme.textTertiary);
  document.body.style.background = theme.bg;
}

async function init() {
  applyDynamicBackground();
  setInterval(applyDynamicBackground, 600000);

  try {
    const { lat, lon } = await getLocation();

    // Start radar immediately — no dependency on grid data
    initRadar(lat, lon);

    const grid = await getGridPoint(lat, lon);
    $('location-name').textContent = grid.city && grid.state
      ? `${grid.city}, ${grid.state}`
      : `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

    const [forecast, hourly, stationId, alerts] = await Promise.all([
      getForecast(grid.forecastUrl),
      getHourlyForecast(grid.forecastHourlyUrl),
      getObservationStation(grid.observationStationsUrl),
      getAlerts(lat, lon)
    ]);

    const observation = await getCurrentObservation(stationId);

    $('current-loading').classList.add('hidden');
    $('current-weather').classList.remove('hidden');
    renderCurrentWeather(observation, forecast, $('current-weather'), lat, lon);

    $('hourly-loading').classList.add('hidden');
    $('hourly-chart').classList.remove('hidden');
    renderHourlyChart(hourly, $('hourly-chart'));

    forecastPeriods = forecast;
    $('forecast-loading').classList.add('hidden');
    $('pill-chart').classList.remove('hidden');
    renderPillChart(forecast, $('pill-chart'), chartMode);

    renderAlerts(alerts, $('alerts-content'), $('alerts-card'));

    $('last-updated').textContent = `Updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

  } catch (err) {
    console.error('Forecast error:', err);
    $('current-loading').classList.add('hidden');
    $('current-weather').classList.remove('hidden');
    showError($('current-weather'), 'Unable to load weather data.', err.message);
    $('forecast-loading').classList.add('hidden');
    const hourlyLoading = $('hourly-loading');
    if (hourlyLoading) hourlyLoading.classList.add('hidden');
  }
}

$('chart-toggle').addEventListener('click', () => {
  chartMode = chartMode === 'horizontal' ? 'vertical' : 'horizontal';
  localStorage.setItem('chartMode', chartMode);
  $('toggle-icon').textContent = chartMode === 'horizontal' ? '\u2195' : '\u2194';
  if (forecastPeriods) {
    renderPillChart(forecastPeriods, $('pill-chart'), chartMode);
  }
});

$('refresh-btn').addEventListener('click', () => {
  sessionStorage.clear();
  location.reload();
});

$('toggle-icon').textContent = chartMode === 'horizontal' ? '\u2195' : '\u2194';

init();
