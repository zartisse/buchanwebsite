import { useEffect, useState } from 'react';
import { useSubmissions } from '../../hooks/useSubmissions';
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
    <form onSubmit={handleSubmit} className={ps.formStack}>
      {props.variant === 'property' && (
        <p className={ps.propertyInquiryContext}>
          Inquiring about: <strong>{props.propertyName}</strong>
          {props.propertyCity ? `, ${props.propertyCity}` : ''}
        </p>
      )}
      <input name="name" type="text" required placeholder="Your name" className={ps.formInput} />
      <input name="email" type="email" required placeholder="Email" className={ps.formInput} />
      <input name="phone" type="tel" placeholder="Phone (optional)" className={ps.formInput} />
      {props.variant === 'contact' ? (
        <select id={subjectSelectId} name="subject" required className={ps.formInput} defaultValue="">
          <option value="" disabled>Select a topic</option>
          {props.serviceOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ) : null}
      <textarea
        name="message"
        required
        placeholder={props.variant === 'property' ? 'Tell us about your interest in this home' : 'Tell us about your project'}
        rows={5}
        className={ps.formInput}
      />
      {error && <p className={ps.formError}>{error}</p>}
      <button type="submit" className={ps.btnPrimary} style={{ alignSelf: 'flex-start' }}>Send Message</button>
    </form>
  );
}
