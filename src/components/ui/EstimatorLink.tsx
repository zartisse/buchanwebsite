import type { ReactNode } from 'react';
import { ESTIMATOR_URL } from '../../lib/estimator';

type EstimatorLinkProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export function EstimatorLink({ children, className, onClick, style, ...rest }: EstimatorLinkProps) {
  return (
    <a
      href={ESTIMATOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClick}
      style={style}
      {...rest}
    >
      {children}
    </a>
  );
}
