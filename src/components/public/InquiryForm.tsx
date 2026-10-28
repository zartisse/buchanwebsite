import { useEffect, useState } from 'react';
import { useSubmissions } from '../../hooks/useSubmissions';
import { fieldErrors } from '../../lib/formValidation';
import { FormField, inputClass } from '../ui/FormField';
import ps from '../../styles/pages.module.css';

type ContactInquiryFormProps = {
  variant: 'contact';
  serviceOptions: string[];
  defaultSubject?: string;
  subjectSelectId?: string;
};

type PropertyInquiryFormProps = {
  variant: 'property';
  propertyName: string;
  propertySlug: string;
  propertyCity?: string;
};

export type InquiryFormProps = ContactInquiryFormProps | PropertyInquiryFormProps;

export function InquiryForm(props: InquiryFormProps) {
  const { createSubmission } = useSubmissions();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  const defaultSubject = props.variant === 'contact' ? props.defaultSubject : undefined;
  const subjectSelectId = props.variant === 'contact' ? (props.subjectSelectId ?? 'jbh-service') : undefined;

  useEffect(() => {
    if (props.variant !== 'contact' || !defaultSubject || !subjectSelectId) return;
    const select = document.getElementById(subjectSelectId) as HTMLSelectElement | null;
    if (select) select.value = defaultSubject;
  }, [props.variant, defaultSubject, subjectSelectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const required =
      props.variant === 'property'
        ? { name: 'Your name', email: 'Email', message: 'A message' }
        : { name: 'Your name', email: 'Email', subject: 'A topic', message: 'A message' };
    const next = fieldErrors(fd, required);
    setFieldErr(next);
    if (Object.keys(next).length) return;

    try {
      if (props.variant === 'property') {
        await createSubmission({
          name: String(fd.get('name') ?? ''),
          email: String(fd.get('email') ?? ''),
          phone: String(fd.get('phone') ?? ''),
          subject: `Interest in ${props.propertyName}`,
          message: String(fd.get('message') ?? ''),
          source: 'Portfolio listing',
          property_slug: props.propertySlug,
          property_name: props.propertyName,
        });
      } else {
        await createSubmission({
          name: String(fd.get('name') ?? ''),
          email: String(fd.get('email') ?? ''),
          phone: String(fd.get('phone') ?? ''),
          subject: String(fd.get('subject') ?? ''),
          message: String(fd.get('message') ?? ''),
          source: 'Contact page',
        });
      }
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send message. Please try again.');
    }
  };

  if (submitted) {
    return (
      <p className={ps.formSuccess}>
        Thank you. We will be in touch within one business day.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={ps.formStack} noValidate>
      {props.variant === 'property' && (
        <p className={ps.propertyInquiryContext}>
          Inquiring about: <strong>{props.propertyName}</strong>
          {props.propertyCity ? `, ${props.propertyCity}` : ''}
        </p>
      )}
      <FormField name="name" error={fieldErr.name}>
        <input
          name="name"
          type="text"
          required
          placeholder="Your name"
          className={inputClass(fieldErr.name)}
          autoComplete="name"
          aria-invalid={!!fieldErr.name}
          aria-describedby={fieldErr.name ? 'name-error' : undefined}
        />
      </FormField>
      <FormField name="email" error={fieldErr.email}>
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className={inputClass(fieldErr.email)}
          autoComplete="email"
          aria-invalid={!!fieldErr.email}
          aria-describedby={fieldErr.email ? 'email-error' : undefined}
        />
      </FormField>
      <input name="phone" type="tel" placeholder="Phone (optional)" className={ps.formInput} autoComplete="tel" />
      {props.variant === 'contact' ? (
        <FormField name="subject" error={fieldErr.subject}>
          <select
            id={subjectSelectId}
            name="subject"
            required
            className={inputClass(fieldErr.subject)}
            defaultValue=""
            aria-invalid={!!fieldErr.subject}
            aria-describedby={fieldErr.subject ? 'subject-error' : undefined}
          >
            <option value="" disabled>Select a topic</option>
            {props.serviceOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>
      ) : null}
      <FormField name="message" error={fieldErr.message}>
        <textarea
          name="message"
          required
          placeholder={props.variant === 'property' ? 'Tell us about your interest in this home' : 'Tell us about your project'}
          rows={5}
          className={inputClass(fieldErr.message)}
          aria-invalid={!!fieldErr.message}
          aria-describedby={fieldErr.message ? 'message-error' : undefined}
        />
      </FormField>
      {error && <p className={ps.formError}>{error}</p>}
      <button type="submit" className={ps.btnPrimary} style={{ alignSelf: 'flex-start' }}>Send Message</button>
    </form>
  );
}
