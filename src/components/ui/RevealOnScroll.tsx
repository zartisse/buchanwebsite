import { useEffect, useRef, type ReactNode } from 'react';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function RevealOnScroll({ children, className = '', style }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

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
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
