'use client';
import { LOCATIONS_BY_COUNTRY } from '@/data/locations';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function LocationSelect({ value, onChange, placeholder = '📍 Select Location', className = '', required }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input ${className}`}
      required={required}
    >
      <option value="">{placeholder}</option>
      {Object.entries(LOCATIONS_BY_COUNTRY).map(([country, cities]) => (
        <optgroup key={country} label={`${cities[0].flag} ${country}`}>
          {cities.map((city) => (
            <option key={`${city.countryCode}-${city.name}`} value={`${city.name}, ${city.country}`}>
              {city.name}{city.province ? ` (${city.province})` : ''}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
