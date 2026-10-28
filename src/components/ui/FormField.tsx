import type { ReactNode } from 'react';
import ps from '../../styles/pages.module.css';

export function FormField({
  name,
  error,
  children,
}: {
  name: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={ps.formField}>
      {children}
      {error ? (
        <p id={`${name}-error`} className={ps.formError} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function inputClass(error?: string) {
  return error ? `${ps.formInput} ${ps.formInputInvalid}` : ps.formInput;
}
