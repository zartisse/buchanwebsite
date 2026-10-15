import { useState } from 'react';
import { useSubmissions } from '../../hooks/useSubmissions';
import ps from '../../styles/pages.module.css';

const TIME_WINDOWS = ['Morning (8:30 AM – 12:00 PM)', 'Afternoon (12:00 PM – 5:00 PM)', 'Flexible'];

export function OfficeVisitForm() {
  const { createSubmission } = useSubmissions();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);

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
    <form onSubmit={handleSubmit} className={ps.formStack}>
      <input name="name" type="text" required placeholder="Your name" className={ps.formInput} autoComplete="name" />
      <input name="email" type="email" required placeholder="Email" className={ps.formInput} autoComplete="email" />
      <input name="phone" type="tel" required placeholder="Phone" className={ps.formInput} autoComplete="tel" />
      <input name="preferred_date" type="date" required className={ps.formInput} aria-label="Preferred visit date" />
      <select name="time_window" required className={ps.formInput} defaultValue="">
        <option value="" disabled>Preferred time</option>
        {TIME_WINDOWS.map((w) => (
          <option key={w} value={w}>{w}</option>
        ))}
      </select>
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
