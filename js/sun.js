// Sunrise/sunset calculator using NOAA solar equations
// Reference: https://gml.noaa.gov/grad/solcalc/solcalc.js

function toRad(deg) { return deg * Math.PI / 180; }
function toDeg(rad) { return rad * 180 / Math.PI; }

function julianDay(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function solarCalc(lat, lon, date) {
  const jd = julianDay(date);
  const n = jd - 2451545.0 + 0.0008;
  const jStar = n - lon / 360;
  const M = (357.5291 + 0.98560028 * jStar) % 360;
  const Mrad = toRad(M);
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = toRad(lambda);
  const decl = Math.asin(Math.sin(lambdaRad) * Math.sin(toRad(23.4397)));
  const jTransit = 2451545.0 + jStar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad);

  const latRad = toRad(lat);
  const cosOmega = (Math.sin(toRad(-0.833)) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));

  if (cosOmega > 1) return { sunrise: null, sunset: null, polar: 'night' };
  if (cosOmega < -1) return { sunrise: null, sunset: null, polar: 'day' };

  const omega = toDeg(Math.acos(cosOmega));
  const jRise = jTransit - omega / 360;
  const jSet = jTransit + omega / 360;

  return {
    sunrise: jdToDate(jRise, date),
    sunset: jdToDate(jSet, date),
    polar: null
  };
}

function jdToDate(jd, refDate) {
  // Convert fractional Julian day to hours/minutes in local time
  const frac = (jd - Math.floor(jd) + 0.5) % 1;
  const totalMinutesUTC = frac * 1440;
  const offsetMinutes = refDate.getTimezoneOffset();
  let localMinutes = totalMinutesUTC - offsetMinutes;
  if (localMinutes < 0) localMinutes += 1440;
  if (localMinutes >= 1440) localMinutes -= 1440;

  const hours = Math.floor(localMinutes / 60);
  const minutes = Math.round(localMinutes % 60);
  return { hours, minutes };
}

export function getSunTimes(lat, lon, date = new Date()) {
  return solarCalc(lat, lon, date);
}

export function formatSunTime(time) {
  if (!time) return '\u2014';
  const h = time.hours % 12 || 12;
  const m = String(time.minutes).padStart(2, '0');
  const ampm = time.hours < 12 ? 'AM' : 'PM';
  return `${h}:${m} ${ampm}`;
}

export function getDayProgress(sunrise, sunset) {
  if (!sunrise || !sunset) return 0.5;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const riseMin = sunrise.hours * 60 + sunrise.minutes;
  const setMin = sunset.hours * 60 + sunset.minutes;

  if (nowMin <= riseMin) return 0;
  if (nowMin >= setMin) return 1;
  return (nowMin - riseMin) / (setMin - riseMin);
}
