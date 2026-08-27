export const OFFICE_ADDRESS_LINES = [
  '2821 Northup Way, Suite 100',
  'Bellevue, WA 98004',
] as const;

export const OFFICE_ADDRESS_QUERY = '2821 Northup Way Suite 100, Bellevue, WA 98004';

export const OFFICE_ADDRESS_TEXT = OFFICE_ADDRESS_LINES.join('\n');

export const OFFICE_ADDRESS_DISPLAY = `${OFFICE_ADDRESS_LINES[0]}\n${OFFICE_ADDRESS_LINES[1]}`;

export const OFFICE_MAP_EMBED_URL =
  `https://maps.google.com/maps?q=${encodeURIComponent(OFFICE_ADDRESS_QUERY)}&hl=en&z=15&output=embed`;

export const OFFICE_MAPS_LINK_URL =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_ADDRESS_QUERY)}`;
