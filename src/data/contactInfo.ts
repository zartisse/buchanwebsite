export const OFFICE_ADDRESS_LINES = [
  '2821 Northup Way, Suite 100',
  'Bellevue, WA 98004',
] as const;

export const OFFICE_ADDRESS_TEXT = OFFICE_ADDRESS_LINES.join('\n');

export const OFFICE_ADDRESS_DISPLAY = `${OFFICE_ADDRESS_LINES[0]}\n${OFFICE_ADDRESS_LINES[1]}`;
