import { createPortal } from 'react-dom';
import { useToast as useToastBase, useToastStore } from './toast-store';

import styles from './toast.module.scss';

export const ToastSpot = () => {
  const toasts = useToastStore();

  return toasts.length > 0 ? createPortal(
    <div className={styles['toast-spot']}>
      {toasts.map((t, i) => (
        <div key={i} className={styles['toast-card']}>
          {t.title} - {t.intent}
        </div>
      ))}
    </div>,
    document.body
  ) : null;
};

export const useToast = useToastBase;
