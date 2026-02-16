// Clean line-art SVG weather icons
// Each returns an SVG string at the given size

const ICONS = {
  'clear-day': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>`,

  'clear-night': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#7c8db5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`,

  'partly-cloudy-day': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="10" cy="8" r="3.5" stroke="#f59e0b"/>
    <line x1="10" y1="2.5" x2="10" y2="3.5" stroke="#f59e0b"/>
    <line x1="5.4" y1="4.4" x2="6.1" y2="5.1" stroke="#f59e0b"/>
    <line x1="3.5" y1="8" x2="4.5" y2="8" stroke="#f59e0b"/>
    <line x1="14.6" y1="4.4" x2="13.9" y2="5.1" stroke="#f59e0b"/>
    <line x1="15.5" y1="8" x2="16.5" y2="8" stroke="#f59e0b"/>
    <path d="M7 19a4 4 0 0 1-.2-8h.6a5 5 0 0 1 9.5 1.5h.6a3 3 0 0 1 .2 6H7z" stroke="#94a3b8" fill="none"/>
  </svg>`,

  'partly-cloudy-night': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 4a5 5 0 0 1-5.5 7" stroke="#7c8db5"/>
    <path d="M7 19a4 4 0 0 1-.2-8h.6a5 5 0 0 1 9.5 1.5h.6a3 3 0 0 1 .2 6H7z" stroke="#94a3b8"/>
  </svg>`,

  'cloudy': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </svg>`,

  'rain': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#94a3b8"/>
    <line x1="8" y1="19" x2="7" y2="22" stroke="#60a5fa"/>
    <line x1="12" y1="19" x2="11" y2="22" stroke="#60a5fa"/>
    <line x1="16" y1="19" x2="15" y2="22" stroke="#60a5fa"/>
  </svg>`,

  'heavy-rain': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#64748b"/>
    <line x1="7" y1="18" x2="5.5" y2="22" stroke="#3b82f6"/>
    <line x1="11" y1="18" x2="9.5" y2="22" stroke="#3b82f6"/>
    <line x1="15" y1="18" x2="13.5" y2="22" stroke="#3b82f6"/>
    <line x1="19" y1="18" x2="17.5" y2="22" stroke="#3b82f6"/>
  </svg>`,

  'snow': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#94a3b8"/>
    <circle cx="8" cy="21" r="0.8" fill="#93c5fd" stroke="none"/>
    <circle cx="12" cy="22" r="0.8" fill="#93c5fd" stroke="none"/>
    <circle cx="16" cy="21" r="0.8" fill="#93c5fd" stroke="none"/>
    <circle cx="10" cy="19.5" r="0.8" fill="#93c5fd" stroke="none"/>
    <circle cx="14" cy="19.5" r="0.8" fill="#93c5fd" stroke="none"/>
  </svg>`,

  'sleet': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#94a3b8"/>
    <line x1="8" y1="19" x2="7.5" y2="21" stroke="#60a5fa"/>
    <line x1="16" y1="19" x2="15.5" y2="21" stroke="#60a5fa"/>
    <circle cx="12" cy="21" r="0.8" fill="#93c5fd" stroke="none"/>
  </svg>`,

  'thunderstorm': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#64748b"/>
    <polyline points="13,17 11,21 14,21 12,24" stroke="#facc15" fill="none"/>
  </svg>`,

  'fog': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="8" x2="21" y2="8"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
    <line x1="3" y1="16" x2="21" y2="16"/>
    <line x1="7" y1="20" x2="17" y2="20"/>
  </svg>`,

  'wind': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2"/>
    <path d="M12.59 19.41A2 2 0 1 0 14 16H2"/>
    <path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2"/>
  </svg>`,

  'haze': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#d4a574" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="4" opacity="0.5"/>
    <line x1="3" y1="14" x2="21" y2="14"/>
    <line x1="5" y1="18" x2="19" y2="18"/>
  </svg>`,

  'raindrop': (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="#60a5fa" fill-opacity="0.6" stroke="#60a5fa" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"/>
  </svg>`
};

// Map NOAA shortForecast text to icon key
const CONDITION_MAP = [
  [/thunder/i, 'thunderstorm'],
  [/hurricane|tropical/i, 'heavy-rain'],
  [/tornado/i, 'wind'],
  [/blizzard/i, 'snow'],
  [/ice|freezing rain|sleet/i, 'sleet'],
  [/snow|flurr/i, 'snow'],
  [/heavy rain|downpour/i, 'heavy-rain'],
  [/rain|shower|drizzle/i, 'rain'],
  [/fog|mist/i, 'fog'],
  [/haze|smoke|dust/i, 'haze'],
  [/wind|breezy|blustery/i, 'wind'],
  [/partly.*cloud|partly.*sunny|mostly.*sunny|few.*cloud/i, null], // day/night variant
  [/mostly.*cloud|consider.*cloud/i, 'cloudy'],
  [/cloud|overcast/i, 'cloudy'],
  [/clear|sunny|fair/i, null], // day/night variant
];

export function getWeatherIcon(shortForecast, isDaytime = true, size = 48) {
  const text = shortForecast || '';

  for (const [pattern, key] of CONDITION_MAP) {
    if (pattern.test(text)) {
      if (key === null) {
        // Day/night variant
        if (/partly|few|mostly.*sunny/i.test(text)) {
          const k = isDaytime ? 'partly-cloudy-day' : 'partly-cloudy-night';
          return ICONS[k](size);
        }
        const k = isDaytime ? 'clear-day' : 'clear-night';
        return ICONS[k](size);
      }
      return ICONS[key](size);
    }
  }

  // Default fallback
  return isDaytime ? ICONS['clear-day'](size) : ICONS['clear-night'](size);
}

export function getRaindropIcon(size = 14) {
  return ICONS['raindrop'](size);
}
