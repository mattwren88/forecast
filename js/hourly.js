import { getWeatherIcon } from './icons.js';

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text != null) e.textContent = text;
  return e;
}

export function renderHourlyChart(periods, container) {
  container.replaceChildren();

  // Take next 24 hours, sample every 1 hour but only label every 3
  const hours = periods.slice(0, 24);
  if (hours.length < 2) return;

  const temps = hours.map(p => p.temperature);
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = maxT - minT || 1;

  const svgW = 560;
  const svgH = 120;
  const padTop = 22;
  const padBottom = 40;
  const padLeft = 8;
  const padRight = 8;
  const chartW = svgW - padLeft - padRight;
  const chartH = svgH - padTop - padBottom;

  const points = hours.map((p, i) => {
    const x = padLeft + (i / (hours.length - 1)) * chartW;
    const y = padTop + (1 - (p.temperature - minT) / range) * chartH;
    return { x, y, temp: p.temperature, time: p.startTime, precip: p.probabilityOfPrecipitation?.value || 0, forecast: p.shortForecast, isDaytime: p.isDaytime };
  });

  // Build SVG
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);
  svg.setAttribute('class', 'hourly-svg');

  // Area fill
  const areaPath = document.createElementNS(ns, 'path');
  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${lineD} L${points[points.length - 1].x.toFixed(1)},${padTop + chartH} L${points[0].x.toFixed(1)},${padTop + chartH} Z`;
  areaPath.setAttribute('d', areaD);
  areaPath.setAttribute('fill', 'url(#areaGrad)');
  areaPath.setAttribute('opacity', '0.3');

  // Gradient definition
  const defs = document.createElementNS(ns, 'defs');
  const grad = document.createElementNS(ns, 'linearGradient');
  grad.setAttribute('id', 'areaGrad');
  grad.setAttribute('x1', '0');
  grad.setAttribute('y1', '0');
  grad.setAttribute('x2', '0');
  grad.setAttribute('y2', '1');
  const stop1 = document.createElementNS(ns, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#f59e0b');
  const stop2 = document.createElementNS(ns, 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#60a5fa');
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  svg.appendChild(areaPath);

  // Line
  const line = document.createElementNS(ns, 'path');
  line.setAttribute('d', lineD);
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', '#f59e0b');
  line.setAttribute('stroke-width', '2');
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(line);

  // Labels every 3 hours
  for (let i = 0; i < points.length; i += 3) {
    const p = points[i];
    const date = new Date(p.time);
    const hour = date.getHours();
    const label = i === 0 ? 'Now' : `${hour % 12 || 12}${hour < 12 ? 'a' : 'p'}`;

    // Temp label above point
    const tempText = document.createElementNS(ns, 'text');
    tempText.setAttribute('x', p.x.toFixed(1));
    tempText.setAttribute('y', (p.y - 6).toFixed(1));
    tempText.setAttribute('text-anchor', 'middle');
    tempText.setAttribute('class', 'hourly-temp-label');
    tempText.textContent = `${p.temp}\u00B0`;
    svg.appendChild(tempText);

    // Dot
    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('cx', p.x.toFixed(1));
    dot.setAttribute('cy', p.y.toFixed(1));
    dot.setAttribute('r', '3');
    dot.setAttribute('fill', '#fff');
    dot.setAttribute('stroke', '#f59e0b');
    dot.setAttribute('stroke-width', '1.5');
    svg.appendChild(dot);

    // Time label below
    const timeText = document.createElementNS(ns, 'text');
    timeText.setAttribute('x', p.x.toFixed(1));
    timeText.setAttribute('y', (padTop + chartH + 14).toFixed(1));
    timeText.setAttribute('text-anchor', 'middle');
    timeText.setAttribute('class', 'hourly-time-label');
    timeText.textContent = label;
    svg.appendChild(timeText);

    // Precip indicator
    if (p.precip > 0) {
      const precipText = document.createElementNS(ns, 'text');
      precipText.setAttribute('x', p.x.toFixed(1));
      precipText.setAttribute('y', (padTop + chartH + 26).toFixed(1));
      precipText.setAttribute('text-anchor', 'middle');
      precipText.setAttribute('class', 'hourly-precip-label');
      precipText.textContent = `${p.precip}%`;
      svg.appendChild(precipText);
    }
  }

  container.appendChild(svg);
}
