import { getWeatherIcon, getRaindropIcon } from './icons.js';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseForecastDays(periods) {
  const days = [];
  let i = 0;

  if (periods.length > 0 && !periods[0].isDaytime) {
    days.push({
      name: periods[0].name.replace(' Night', ''),
      high: null,
      low: periods[0].temperature,
      isToday: true,
      forecast: periods[0].shortForecast,
      isDaytime: false,
      precip: periods[0].probabilityOfPrecipitation?.value || 0
    });
    i = 1;
  }

  while (i < periods.length && days.length < 7) {
    const day = periods[i];
    const night = periods[i + 1];
    const date = new Date(day.startTime);
    const dayName = days.length === 0 && i <= 1 ? 'Today' : DAY_NAMES[date.getDay()];

    days.push({
      name: dayName,
      high: day.temperature,
      low: night ? night.temperature : day.temperature,
      isToday: dayName === 'Today',
      forecast: day.shortForecast,
      isDaytime: true,
      precip: Math.max(day.probabilityOfPrecipitation?.value || 0, night?.probabilityOfPrecipitation?.value || 0)
    });
    i += 2;
  }

  if (days[0] && days[0].high == null && days[1]) {
    days[0].high = days[0].low;
  }

  return days;
}

function tempColor(temp, min, max) {
  const ratio = max === min ? 0.5 : (temp - min) / (max - min);
  const r = Math.round(109 + ratio * (242 - 109));
  const g = Math.round(179 + ratio * (136 - 179));
  const b = Math.round(242 + ratio * (109 - 242));
  return `rgb(${r}, ${g}, ${b})`;
}

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text != null) e.textContent = text;
  return e;
}

// Safe SVG insertion: parse trusted SVG string via DOMParser
function insertSvg(container, svgString) {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;
  if (svg.nodeName === 'svg') {
    container.appendChild(document.importNode(svg, true));
  }
}

export function renderPillChart(periods, container, mode = 'horizontal') {
  const days = parseForecastDays(periods);
  container.replaceChildren();

  if (days.length === 0) {
    container.appendChild(el('p', null, 'No forecast data available.'));
    return;
  }

  const allTemps = days.flatMap(d => [d.high, d.low].filter(t => t != null));
  const weekMin = Math.min(...allTemps);
  const weekMax = Math.max(...allTemps);
  const range = weekMax - weekMin || 1;

  if (mode === 'horizontal') {
    renderHorizontal(days, container, weekMin, weekMax, range);
  } else {
    renderVertical(days, container, weekMin, weekMax, range);
  }
}

function renderHorizontal(days, container, weekMin, weekMax, range) {
  const wrap = el('div', 'pill-chart-h');

  for (const day of days) {
    const low = day.low ?? day.high;
    const high = day.high ?? day.low;
    const left = ((low - weekMin) / range) * 100;
    const width = Math.max(((high - low) / range) * 100, 3);

    const row = el('div', `pill-row${day.isToday ? ' today' : ''}`);

    // Weather icon
    const iconWrap = el('span', 'pill-icon');
    insertSvg(iconWrap, getWeatherIcon(day.forecast, day.isDaytime, 20));
    row.appendChild(iconWrap);

    row.appendChild(el('span', 'pill-day', day.name));
    row.appendChild(el('span', 'pill-low', `${low}\u00B0`));

    const track = el('div', 'pill-track');
    const bar = el('div', 'pill-bar');
    bar.style.left = `${left}%`;
    bar.style.width = `${width}%`;
    bar.style.background = `linear-gradient(90deg, ${tempColor(low, weekMin, weekMax)}, ${tempColor(high, weekMin, weekMax)})`;
    track.appendChild(bar);
    row.appendChild(track);

    row.appendChild(el('span', 'pill-high', `${high}\u00B0`));

    // Precip probability
    if (day.precip > 0) {
      const precipWrap = el('span', 'pill-precip');
      insertSvg(precipWrap, getRaindropIcon(12));
      precipWrap.appendChild(document.createTextNode(`${day.precip}%`));
      row.appendChild(precipWrap);
    } else {
      row.appendChild(el('span', 'pill-precip-spacer'));
    }

    wrap.appendChild(row);
  }

  container.appendChild(wrap);
}

function renderVertical(days, container, weekMin, weekMax, range) {
  const outer = el('div', 'pill-chart-v-wrapper');
  const wrap = el('div', 'pill-chart-v');

  for (const day of days) {
    const low = day.low ?? day.high;
    const high = day.high ?? day.low;
    const bottom = ((low - weekMin) / range) * 100;
    const height = Math.max(((high - low) / range) * 100, 5);

    const col = el('div', `pill-col${day.isToday ? ' today' : ''}`);
    col.appendChild(el('span', 'pill-col-high', `${high}\u00B0`));

    const track = el('div', 'pill-col-track');
    const bar = el('div', 'pill-col-bar');
    bar.style.bottom = `${bottom}%`;
    bar.style.height = `${height}%`;
    bar.style.background = `linear-gradient(to top, ${tempColor(low, weekMin, weekMax)}, ${tempColor(high, weekMin, weekMax)})`;
    track.appendChild(bar);
    col.appendChild(track);

    col.appendChild(el('span', 'pill-col-low', `${low}\u00B0`));

    // Icon below temp
    const iconWrap = el('span', 'pill-col-icon');
    insertSvg(iconWrap, getWeatherIcon(day.forecast, day.isDaytime, 18));
    col.appendChild(iconWrap);

    col.appendChild(el('span', 'pill-col-label', day.name));

    // Precip below label
    if (day.precip > 0) {
      const precipWrap = el('span', 'pill-col-precip');
      insertSvg(precipWrap, getRaindropIcon(10));
      precipWrap.appendChild(document.createTextNode(`${day.precip}%`));
      col.appendChild(precipWrap);
    }

    wrap.appendChild(col);
  }

  outer.appendChild(wrap);
  container.appendChild(outer);
}
