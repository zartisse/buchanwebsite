import { useState } from 'react';
import { useSubmissions } from '../../hooks/useSubmissions';
import { fieldErrors } from '../../lib/formValidation';
import { FormField, inputClass } from '../ui/FormField';
import ps from '../../styles/pages.module.css';

const TIME_WINDOWS = ['Morning (8:30 AM – 12:00 PM)', 'Afternoon (12:00 PM – 5:00 PM)', 'Flexible'];

export function OfficeVisitForm() {
  const { createSubmission } = useSubmissions();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const next = fieldErrors(fd, {
      name: 'Your name',
      email: 'Email',
      phone: 'Phone',
      preferred_date: 'A preferred date',
      time_window: 'A preferred time',
    });
    setFieldErr(next);
    if (Object.keys(next).length) return;

    const preferredDate = String(fd.get('preferred_date') ?? '');
    const timeWindow = String(fd.get('time_window') ?? '');
    const note = String(fd.get('note') ?? '').trim();

    const message = [
      `Preferred date: ${preferredDate}`,
      `Preferred time: ${timeWindow}`,
      note ? `Note: ${note}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await createSubmission({
        name: String(fd.get('name') ?? ''),
        email: String(fd.get('email') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        subject: 'Office visit request',
        message,
        source: 'Contact page — office visit',
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send request. Please try again.');
    }
  };

  if (submitted) {
    return (
      <p className={ps.formSuccess}>
        Thank you. We will confirm your office visit within one business day.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={ps.formStack} noValidate>
      <FormField name="name" error={fieldErr.name}>
        <input name="name" type="text" required placeholder="Your name" className={inputClass(fieldErr.name)} autoComplete="name" aria-invalid={!!fieldErr.name} aria-describedby={fieldErr.name ? 'name-error' : undefined} />
      </FormField>
      <FormField name="email" error={fieldErr.email}>
        <input name="email" type="email" required placeholder="Email" className={inputClass(fieldErr.email)} autoComplete="email" aria-invalid={!!fieldErr.email} aria-describedby={fieldErr.email ? 'email-error' : undefined} />
      </FormField>
      <FormField name="phone" error={fieldErr.phone}>
        <input name="phone" type="tel" required placeholder="Phone" className={inputClass(fieldErr.phone)} autoComplete="tel" aria-invalid={!!fieldErr.phone} aria-describedby={fieldErr.phone ? 'phone-error' : undefined} />
      </FormField>
      <FormField name="preferred_date" error={fieldErr.preferred_date}>
        <input name="preferred_date" type="date" required className={inputClass(fieldErr.preferred_date)} aria-label="Preferred visit date" aria-invalid={!!fieldErr.preferred_date} aria-describedby={fieldErr.preferred_date ? 'preferred_date-error' : undefined} />
      </FormField>
      <FormField name="time_window" error={fieldErr.time_window}>
        <select name="time_window" required className={inputClass(fieldErr.time_window)} defaultValue="" aria-invalid={!!fieldErr.time_window} aria-describedby={fieldErr.time_window ? 'time_window-error' : undefined}>
          <option value="" disabled>Preferred time</option>
          {TIME_WINDOWS.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </FormField>
      <textarea
        name="note"
        placeholder="What would you like to discuss? (optional)"
        rows={4}
        className={ps.formInput}
      />
      {error && <p className={ps.formError}>{error}</p>}
      <button type="submit" className={ps.btnPrimary} style={{ alignSelf: 'flex-start' }}>
        Request office appointment
      </button>
    </form>
  );
}
