export function fieldErrors(
  fd: FormData,
  required: Record<string, string>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [name, label] of Object.entries(required)) {
    if (!String(fd.get(name) ?? '').trim()) {
      errors[name] = `Enter ${label.toLowerCase()}`;
    }
  }
  const email = String(fd.get('email') ?? '').trim();
  if (email && !errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }
  return errors;
}
