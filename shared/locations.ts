// Kwisoko — East & Central Africa Location Data
// Used across frontend and backend for location filtering

export interface City {
  name: string;
  province?: string;
  country: string;
  countryCode: string;
  flag: string;
}

export const LOCATIONS: City[] = [
  // ── RWANDA ──────────────────────────────────────────────
  { name: 'Kigali', province: 'Kigali City', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Nyarugenge', province: 'Kigali City', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Gasabo', province: 'Kigali City', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Kicukiro', province: 'Kigali City', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Musanze', province: 'Northern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Rubavu', province: 'Western Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Gisenyi', province: 'Western Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Huye', province: 'Southern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Butare', province: 'Southern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Muhanga', province: 'Southern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Rwamagana', province: 'Eastern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Kayonza', province: 'Eastern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Nyagatare', province: 'Eastern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Rusizi', province: 'Western Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Karongi', province: 'Western Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Nyamasheke', province: 'Western Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Gicumbi', province: 'Northern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Rulindo', province: 'Northern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Burera', province: 'Northern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Gakenke', province: 'Northern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Nyanza', province: 'Southern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Gisagara', province: 'Southern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Ruhango', province: 'Southern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Kamonyi', province: 'Southern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Kirehe', province: 'Eastern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Ngoma', province: 'Eastern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Bugesera', province: 'Eastern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },
  { name: 'Gatsibo', province: 'Eastern Province', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼' },

  // ── UGANDA ──────────────────────────────────────────────
  { name: 'Kampala', country: 'Uganda', countryCode: 'UG', flag: '🇺🇬' },
  { name: 'Entebbe', country: 'Uganda', countryCode: 'UG', flag: '🇺🇬' },
  { name: 'Jinja', country: 'Uganda', countryCode: 'UG', flag: '🇺🇬' },
  { name: 'Mbarara', country: 'Uganda', countryCode: 'UG', flag: '🇺🇬' },
  { name: 'Gulu', country: 'Uganda', countryCode: 'UG', flag: '🇺🇬' },
  { name: 'Kabale', country: 'Uganda', countryCode: 'UG', flag: '🇺🇬' },

  // ── KENYA ────────────────────────────────────────────────
  { name: 'Nairobi', country: 'Kenya', countryCode: 'KE', flag: '🇰🇪' },
  { name: 'Mombasa', country: 'Kenya', countryCode: 'KE', flag: '🇰🇪' },
  { name: 'Kisumu', country: 'Kenya', countryCode: 'KE', flag: '🇰🇪' },
  { name: 'Nakuru', country: 'Kenya', countryCode: 'KE', flag: '🇰🇪' },
  { name: 'Eldoret', country: 'Kenya', countryCode: 'KE', flag: '🇰🇪' },

  // ── TANZANIA ─────────────────────────────────────────────
  { name: 'Dar es Salaam', country: 'Tanzania', countryCode: 'TZ', flag: '🇹🇿' },
  { name: 'Dodoma', country: 'Tanzania', countryCode: 'TZ', flag: '🇹🇿' },
  { name: 'Arusha', country: 'Tanzania', countryCode: 'TZ', flag: '🇹🇿' },
  { name: 'Mwanza', country: 'Tanzania', countryCode: 'TZ', flag: '🇹🇿' },
  { name: 'Zanzibar', country: 'Tanzania', countryCode: 'TZ', flag: '🇹🇿' },

  // ── BURUNDI ──────────────────────────────────────────────
  { name: 'Bujumbura', country: 'Burundi', countryCode: 'BI', flag: '🇧🇮' },
  { name: 'Gitega', country: 'Burundi', countryCode: 'BI', flag: '🇧🇮' },
  { name: 'Ngozi', country: 'Burundi', countryCode: 'BI', flag: '🇧🇮' },

  // ── DRC ──────────────────────────────────────────────────
  { name: 'Kinshasa', country: 'DR Congo', countryCode: 'CD', flag: '🇨🇩' },
  { name: 'Goma', country: 'DR Congo', countryCode: 'CD', flag: '🇨🇩' },
  { name: 'Bukavu', country: 'DR Congo', countryCode: 'CD', flag: '🇨🇩' },
  { name: 'Lubumbashi', country: 'DR Congo', countryCode: 'CD', flag: '🇨🇩' },

  // ── ETHIOPIA ─────────────────────────────────────────────
  { name: 'Addis Ababa', country: 'Ethiopia', countryCode: 'ET', flag: '🇪🇹' },
  { name: 'Dire Dawa', country: 'Ethiopia', countryCode: 'ET', flag: '🇪🇹' },

  // ── SOUTH SUDAN ──────────────────────────────────────────
  { name: 'Juba', country: 'South Sudan', countryCode: 'SS', flag: '🇸🇸' },
];

// Group by country
export const LOCATIONS_BY_COUNTRY = LOCATIONS.reduce((acc, loc) => {
  if (!acc[loc.country]) acc[loc.country] = [];
  acc[loc.country].push(loc);
  return acc;
}, {} as Record<string, City[]>);

// Rwanda only
export const RWANDA_LOCATIONS = LOCATIONS.filter((l) => l.countryCode === 'RW');

// Rwanda provinces
export const RWANDA_PROVINCES = [
  'Kigali City',
  'Northern Province',
  'Southern Province',
  'Eastern Province',
  'Western Province',
];

// All country names
export const COUNTRIES = [...new Set(LOCATIONS.map((l) => l.country))];

// Search helper
export function searchLocations(query: string): City[] {
  const q = query.toLowerCase();
  return LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      (l.province?.toLowerCase().includes(q) ?? false),
  ).slice(0, 10);
}
