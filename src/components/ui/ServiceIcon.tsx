import type { ServiceIconName } from '../../types';

type ServiceIconProps = {
  name: ServiceIconName;
  className?: string;
  size?: number;
};

const stroke = 'currentColor';

export function ServiceIcon({ name, className, size = 32 }: ServiceIconProps) {
  const props = {
    className,
    width: size,
    height: size,
    viewBox: '0 0 32 32',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true as const,
  };

  switch (name) {
    case 'custom-home':
      return (
        <svg {...props}>
          <path d="M4 14 16 4l12 10" stroke={stroke} strokeWidth="1.2" />
          <path d="M8 13v14h16V13" stroke={stroke} strokeWidth="1.2" />
          <path d="M13 27v-8h6v8" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'renovation':
      return (
        <svg {...props}>
          <path d="M6 26h20" stroke={stroke} strokeWidth="1.2" />
          <path d="M10 26V12l6-6 6 6v14" stroke={stroke} strokeWidth="1.2" />
          <path d="M14 18h4M14 22h4" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'adu':
      return (
        <svg {...props}>
          <rect x="5" y="12" width="22" height="14" stroke={stroke} strokeWidth="1.2" />
          <path d="M5 12 16 5l11 7" stroke={stroke} strokeWidth="1.2" />
          <path d="M13 26v-6h6v6" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'fire-restoration':
      return (
        <svg {...props}>
          <path d="M16 4c-2 6-8 8-8 14a8 8 0 0 0 16 0c0-6-6-8-8-14Z" stroke={stroke} strokeWidth="1.2" />
          <path d="M16 18v8M12 22h8" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'real-estate':
      return (
        <svg {...props}>
          <path d="M4 14 16 5l12 9" stroke={stroke} strokeWidth="1.2" />
          <path d="M8 13v13h16V13" stroke={stroke} strokeWidth="1.2" />
          <path d="M20 8h4v5" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'maintenance':
      return (
        <svg {...props}>
          <path d="M8 22l4-4 2 2 6-6" stroke={stroke} strokeWidth="1.2" />
          <circle cx="10" cy="10" r="4" stroke={stroke} strokeWidth="1.2" />
          <path d="M13 13l3 3" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'building':
      return (
        <svg {...props}>
          <path d="M6 26V10l10-5 10 5v16" stroke={stroke} strokeWidth="1.2" />
          <path d="M12 26v-8h8v8" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'blueprint':
      return (
        <svg {...props}>
          <rect x="5" y="5" width="22" height="22" stroke={stroke} strokeWidth="1.2" />
          <path d="M5 12h22M12 5v22M5 19h10" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'hammer':
      return (
        <svg {...props}>
          <path d="M8 24 20 12" stroke={stroke} strokeWidth="1.2" />
          <path d="M18 8l6 6-4 4-6-6 4-4Z" stroke={stroke} strokeWidth="1.2" />
          <path d="M6 26 10 22" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'water':
      return (
        <svg {...props}>
          <path d="M16 6c-4 6-10 9-10 15a10 10 0 0 0 20 0c0-6-6-9-10-15Z" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'structure':
      return (
        <svg {...props}>
          <path d="M6 26V8l10-4 10 4v18" stroke={stroke} strokeWidth="1.2" />
          <path d="M6 14h20M6 20h20" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'comfort':
      return (
        <svg {...props}>
          <path d="M16 6c-2 4-6 5-6 9a6 6 0 0 0 12 0c0-4-4-5-6-9Z" stroke={stroke} strokeWidth="1.2" />
          <path d="M10 26c2-2 10-2 12 0" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'craft':
      return (
        <svg {...props}>
          <path d="M8 24 18 14" stroke={stroke} strokeWidth="1.2" />
          <path d="M16 10l6-2 2 6-8 8-6-6 6-6Z" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="16" cy="16" r="10" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
  }
}
