import { useEffect, useRef, type ReactNode } from 'react';

type RevealVariant = 'up' | 'scale' | 'left';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: RevealVariant;
  index?: number;
}

export function RevealOnScroll({
  children,
  className = '',
  style,
  variant = 'up',
  index = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const delayMs = Math.min(index * 90, 360);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${className}`}
      style={{ ...style, transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
