import { useEffect } from 'react';
import styles from './CustomCursor.module.css';

export function CustomCursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.createElement('div');
    cursor.id = 'jbh-cursor';
    cursor.className = styles.cursor;
    document.body.appendChild(cursor);

    let raf = 0;
    let x = -100;
    let y = -100;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          cursor.style.transform = `translate(${x - 15}px, ${y - 15}px)`;
          raf = 0;
        });
      }
    };

    const over = () => {
      cursor.style.opacity = '1';
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.background = 'rgba(176,130,76,0.08)';
    };

    const out = () => {
      cursor.style.width = '30px';
      cursor.style.height = '30px';
      cursor.style.background = 'transparent';
    };

    document.addEventListener('mousemove', move);
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', over);
      el.addEventListener('mouseleave', out);
    });

    return () => {
      document.removeEventListener('mousemove', move);
      cursor.remove();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
