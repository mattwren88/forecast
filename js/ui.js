import { getWeatherIcon } from './icons.js';
import { getSunTimes, formatSunTime, getDayProgress } from './sun.js';

function cToF(c) {
  if (c == null) return null;
  return Math.round(c * 9 / 5 + 32);
}

function formatTemp(value, unit) {
  if (value == null) return '\u2014';
  if (unit === 'wmoUnit:degC') return `${cToF(value)}\u00B0`;
  return `${Math.round(value)}\u00B0`;
}

function metersToMiles(m) {
  if (m == null) return '\u2014';
  return `${(m / 1609.34).toFixed(1)} mi`;
}

function pascalToInHg(pa) {
  if (pa == null) return '\u2014';
  return `${(pa / 3386.39).toFixed(2)} in`;
}

function kphToMph(kph) {
  if (kph == null) return '\u2014';
  return `${Math.round(kph * 0.621371)} mph`;
}

function windDirection(deg) {
  if (deg == null) return '';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text != null) e.textContent = text;
  return e;
}

function detailItem(label, value) {
  const item = el('div', 'detail-item');
  item.appendChild(el('span', 'detail-label', label));
  item.appendChild(el('span', 'detail-value', value));
  return item;
}

function getFeelsLike(observation) {
  const wc = observation.windChill?.value;
  const hi = observation.heatIndex?.value;
  const unit = observation.windChill?.unitCode || observation.heatIndex?.unitCode;
  if (wc != null) return formatTemp(wc, unit);
  if (hi != null) return formatTemp(hi, unit);
  return null;
}

export function renderCurrentWeather(observation, forecast, container, lat, lon) {
  container.replaceChildren();

  const temp = observation.temperature?.value;
  const tempUnit = observation.temperature?.unitCode;
  const condition = observation.textDescription || '';
  const humidity = observation.relativeHumidity?.value;
  const dewpoint = observation.dewpoint?.value;
  const dewUnit = observation.dewpoint?.unitCode;
  const wind = observation.windSpeed?.value;
  const windDir = observation.windDirection?.value;
  const pressure = observation.barometricPressure?.value;
  const visibility = observation.visibility?.value;

  // Determine if daytime
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 20;

  let high = '\u2014', low = '\u2014';
  if (forecast && forecast.length >= 2) {
    const dayPeriod = forecast.find(p => p.isDaytime);
    const nightPeriod = forecast.find(p => !p.isDaytime);
    if (dayPeriod) high = `${dayPeriod.temperature}\u00B0`;
    if (nightPeriod) low = `${nightPeriod.temperature}\u00B0`;
  }

  const main = el('div', 'current-main');

  // Custom SVG icon
  const iconWrap = el('div', 'current-icon');
  iconWrap.innerHTML = getWeatherIcon(condition, isDaytime, 56);
  main.appendChild(iconWrap);

  main.appendChild(el('div', 'current-temp', formatTemp(temp, tempUnit)));

  // Feels like
  const feelsLike = getFeelsLike(observation);
  if (feelsLike) {
    main.appendChild(el('div', 'current-feels-like', `Feels like ${feelsLike}`));
  }

  main.appendChild(el('div', 'current-condition', condition));

  const details = el('div', 'current-details');
  details.appendChild(detailItem('High', high));
  details.appendChild(detailItem('Low', low));
  details.appendChild(detailItem('Humidity', humidity != null ? `${Math.round(humidity)}%` : '\u2014'));
  details.appendChild(detailItem('Dew Point', formatTemp(dewpoint, dewUnit)));
  details.appendChild(detailItem('Wind', `${kphToMph(wind)} ${windDirection(windDir)}`));
  details.appendChild(detailItem('Pressure', pascalToInHg(pressure)));
  details.appendChild(detailItem('Visibility', metersToMiles(visibility)));

  // Sunrise/sunset
  if (lat != null && lon != null) {
    const sun = getSunTimes(lat, lon);
    details.appendChild(detailItem('Sunrise', formatSunTime(sun.sunrise)));
    details.appendChild(detailItem('Sunset', formatSunTime(sun.sunset)));

    // Sun arc
    if (sun.sunrise && sun.sunset) {
      const progress = getDayProgress(sun.sunrise, sun.sunset);
      const arc = buildSunArc(progress, isDaytime);
      details.appendChild(arc);
    }
  }

  container.appendChild(main);
  container.appendChild(details);
}

function buildSunArc(progress, isDaytime) {
  const wrap = el('div', 'sun-arc-wrap');
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 100 50');
  svg.setAttribute('class', 'sun-arc-svg');

  // Arc path (semicircle)
  const arcPath = document.createElementNS(ns, 'path');
  arcPath.setAttribute('d', 'M 10 45 Q 50 -10 90 45');
  arcPath.setAttribute('fill', 'none');
  arcPath.setAttribute('stroke', isDaytime ? '#f59e0b' : '#7c8db5');
  arcPath.setAttribute('stroke-width', '1.5');
  arcPath.setAttribute('stroke-dasharray', '3 2');
  arcPath.setAttribute('opacity', '0.4');
  svg.appendChild(arcPath);

  // Horizon line
  const horizon = document.createElementNS(ns, 'line');
  horizon.setAttribute('x1', '5');
  horizon.setAttribute('y1', '45');
  horizon.setAttribute('x2', '95');
  horizon.setAttribute('y2', '45');
  horizon.setAttribute('stroke', '#cbd5e1');
  horizon.setAttribute('stroke-width', '0.8');
  svg.appendChild(horizon);

  // Sun dot along the arc
  // Parametric: t goes 0 to 1 along the quadratic bezier M10,45 Q50,-10 90,45
  const t = Math.max(0, Math.min(1, progress));
  const x = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 50 + t * t * 90;
  const y = (1 - t) * (1 - t) * 45 + 2 * (1 - t) * t * (-10) + t * t * 45;

  const dot = document.createElementNS(ns, 'circle');
  dot.setAttribute('cx', x.toFixed(1));
  dot.setAttribute('cy', y.toFixed(1));
  dot.setAttribute('r', '4');
  dot.setAttribute('fill', isDaytime ? '#f59e0b' : '#7c8db5');
  svg.appendChild(dot);

  wrap.appendChild(svg);
  return wrap;
}

export function renderAlerts(alerts, container, card) {
  if (!alerts || alerts.length === 0) {
    card.classList.add('hidden');
    return;
  }

  card.classList.remove('hidden');
  container.replaceChildren();

  const hasSevere = alerts.some(a => {
    const sev = a.properties?.severity;
    return sev === 'Extreme' || sev === 'Severe';
  });

  if (hasSevere) card.classList.add('severe');
  else card.classList.remove('severe');

  for (const a of alerts) {
    const p = a.properties;
    const item = el('div', 'alert-item');
    item.appendChild(el('div', 'alert-event', p.event || 'Alert'));
    item.appendChild(el('div', 'alert-headline', p.headline || ''));

    if (p.description) {
      const toggle = el('button', 'alert-toggle', 'Show details');
      const desc = el('div', 'alert-desc', p.description);
      toggle.addEventListener('click', () => desc.classList.toggle('expanded'));
      item.appendChild(toggle);
      item.appendChild(desc);
    }

    container.appendChild(item);
  }
}

export function showError(container, message, detail) {
  container.replaceChildren();
  const wrap = el('div', 'error-message');
  wrap.appendChild(el('p', null, message));
  if (detail) wrap.appendChild(el('p', 'error-detail', detail));
  container.appendChild(wrap);
}
