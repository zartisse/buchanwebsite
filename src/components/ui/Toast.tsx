import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

let showToast: ((msg: string) => void) | null = null;

export function toast(msg: string) {
  showToast?.(msg);
}

export function ToastProvider() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    showToast = (msg: string) => {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), 2200);
    };
    return () => { showToast = null; };
  }, []);

  return (
    <div className={`${styles.toast} ${visible ? styles.visible : ''}`}>
      {message}
    </div>
  );
}
