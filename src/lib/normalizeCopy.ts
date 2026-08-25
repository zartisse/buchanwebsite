/** Strip em dashes from public copy; use commas or rephrase-friendly spacing. */
export function normalizeEmDash(text: string): string {
  return text
    .replace(/\s*—\s*/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*\./g, '.')
    .trim();
}

export function deepNormalizeCopy<T>(value: T): T {
  if (typeof value === 'string') {
    return normalizeEmDash(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepNormalizeCopy(item)) as T;
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = deepNormalizeCopy(val);
    }
    return out as T;
  }
  return value;
}
