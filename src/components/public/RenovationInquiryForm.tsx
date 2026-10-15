import { useState } from 'react';
import { useSubmissions } from '../../hooks/useSubmissions';
import ps from '../../styles/pages.module.css';

const READINESS_OPTIONS = [
  'Just exploring ideas',
  'Have ideas, need a plan',
  'Plans or drawings in progress',
  'Ready to hire a builder',
];

const URGENCY_OPTIONS = ['Flexible', 'Within 6 months', 'Within 3 months', 'As soon as possible'];

function formatSubmissionMessage(fields: Record<string, string>) {
  return Object.entries(fields)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

export function RenovationInquiryForm() {
  const { createSubmission } = useSubmissions();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);

    const message = formatSubmissionMessage({
      Location: String(fd.get('location') ?? ''),
      Motivation: String(fd.get('motivation') ?? ''),
      'Project description': String(fd.get('description') ?? ''),
      'How ready they are': String(fd.get('readiness') ?? ''),
      Urgency: String(fd.get('urgency') ?? ''),
      'Target start': String(fd.get('target_start') ?? ''),
      'Target finish': String(fd.get('target_finish') ?? ''),
    });

    try {
      await createSubmission({
        name: String(fd.get('name') ?? ''),
        email: String(fd.get('email') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        subject: 'Renovation inquiry',
        message,
        source: 'Renovations page',
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send inquiry. Please try again.');
    }
  };

  if (submitted) {
    return (
      <p className={ps.formSuccess}>
        Thank you. We will review your renovation inquiry and respond within one business day.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={ps.formStack}>
      <input name="location" type="text" required placeholder="Location (city, neighborhood, or address)" className={ps.formInput} />
      <textarea
        name="motivation"
        required
        placeholder="What motivated this renovation?"
        rows={3}
        className={ps.formInput}
      />
      <textarea
        name="description"
        required
        placeholder="Brief description of what you want"
        rows={4}
        className={ps.formInput}
      />
      <select name="readiness" required className={ps.formInput} defaultValue="">
        <option value="" disabled>How ready are you?</option>
        {READINESS_OPTIONS.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <select name="urgency" required className={ps.formInput} defaultValue="">
        <option value="" disabled>Urgency</option>
        {URGENCY_OPTIONS.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <input name="target_start" type="text" required placeholder="When do you want to start? (e.g. Spring 2026)" className={ps.formInput} />
      <input name="target_finish" type="text" required placeholder="When do you hope to finish? (e.g. Fall 2026)" className={ps.formInput} />
      <input name="name" type="text" required placeholder="Your name" className={ps.formInput} autoComplete="name" />
      <input name="email" type="email" required placeholder="Email" className={ps.formInput} autoComplete="email" />
      <input name="phone" type="tel" placeholder="Phone (optional)" className={ps.formInput} autoComplete="tel" />
      {error && <p className={ps.formError}>{error}</p>}
      <button type="submit" className={ps.btnPrimary} style={{ alignSelf: 'flex-start' }}>
        Submit renovation inquiry
      </button>
    </form>
  );
}
