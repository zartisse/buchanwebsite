import { useState } from 'react';
import { useSubmissions } from '../../hooks/useSubmissions';
import { fieldErrors } from '../../lib/formValidation';
import { FormField, inputClass } from '../ui/FormField';
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
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const next = fieldErrors(fd, {
      location: 'A location',
      motivation: 'What motivated this renovation',
      description: 'A short description',
      readiness: 'How ready you are',
      urgency: 'Urgency',
      target_start: 'When you want to start',
      target_finish: 'When you hope to finish',
      name: 'Your name',
      email: 'Email',
    });
    setFieldErr(next);
    if (Object.keys(next).length) return;

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
    <form onSubmit={handleSubmit} className={ps.formStack} noValidate>
      <FormField name="location" error={fieldErr.location}>
        <input name="location" type="text" required placeholder="Location (city, neighborhood, or address)" className={inputClass(fieldErr.location)} aria-invalid={!!fieldErr.location} aria-describedby={fieldErr.location ? 'location-error' : undefined} />
      </FormField>
      <FormField name="motivation" error={fieldErr.motivation}>
        <textarea name="motivation" required placeholder="What motivated this renovation?" rows={3} className={inputClass(fieldErr.motivation)} aria-invalid={!!fieldErr.motivation} aria-describedby={fieldErr.motivation ? 'motivation-error' : undefined} />
      </FormField>
      <FormField name="description" error={fieldErr.description}>
        <textarea name="description" required placeholder="Brief description of what you want" rows={4} className={inputClass(fieldErr.description)} aria-invalid={!!fieldErr.description} aria-describedby={fieldErr.description ? 'description-error' : undefined} />
      </FormField>
      <FormField name="readiness" error={fieldErr.readiness}>
        <select name="readiness" required className={inputClass(fieldErr.readiness)} defaultValue="" aria-invalid={!!fieldErr.readiness} aria-describedby={fieldErr.readiness ? 'readiness-error' : undefined}>
          <option value="" disabled>How ready are you?</option>
          {READINESS_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </FormField>
      <FormField name="urgency" error={fieldErr.urgency}>
        <select name="urgency" required className={inputClass(fieldErr.urgency)} defaultValue="" aria-invalid={!!fieldErr.urgency} aria-describedby={fieldErr.urgency ? 'urgency-error' : undefined}>
          <option value="" disabled>Urgency</option>
          {URGENCY_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </FormField>
      <FormField name="target_start" error={fieldErr.target_start}>
        <input name="target_start" type="text" required placeholder="When do you want to start? (e.g. Spring 2026)" className={inputClass(fieldErr.target_start)} aria-invalid={!!fieldErr.target_start} aria-describedby={fieldErr.target_start ? 'target_start-error' : undefined} />
      </FormField>
      <FormField name="target_finish" error={fieldErr.target_finish}>
        <input name="target_finish" type="text" required placeholder="When do you hope to finish? (e.g. Fall 2026)" className={inputClass(fieldErr.target_finish)} aria-invalid={!!fieldErr.target_finish} aria-describedby={fieldErr.target_finish ? 'target_finish-error' : undefined} />
      </FormField>
      <FormField name="name" error={fieldErr.name}>
        <input name="name" type="text" required placeholder="Your name" className={inputClass(fieldErr.name)} autoComplete="name" aria-invalid={!!fieldErr.name} aria-describedby={fieldErr.name ? 'name-error' : undefined} />
      </FormField>
      <FormField name="email" error={fieldErr.email}>
        <input name="email" type="email" required placeholder="Email" className={inputClass(fieldErr.email)} autoComplete="email" aria-invalid={!!fieldErr.email} aria-describedby={fieldErr.email ? 'email-error' : undefined} />
      </FormField>
      <input name="phone" type="tel" placeholder="Phone (optional)" className={ps.formInput} autoComplete="tel" />
      {error && <p className={ps.formError}>{error}</p>}
      <button type="submit" className={ps.btnPrimary} style={{ alignSelf: 'flex-start' }}>
        Submit renovation inquiry
      </button>
    </form>
  );
}
