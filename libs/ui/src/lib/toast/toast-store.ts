import { useSyncExternalStore } from 'react';

type Toast = {
  id: string | number;
  intent: 'success' | 'info' | 'warning' | 'error' | 'loading';
  title: string;
  description?: string;
  duration?: number;
  promise?: () => Promise<unknown>;
};

const createGenId = () => {
  let count = 1;

  return () => {
    return ++count;
  };
};

const genId = createGenId();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let toastState: Toast[] = [];

const subscribers = new Set<() => void>();

const notifySubscribers = () => {
  subscribers.forEach((o) => o());
};

const removeToast = (toast: Toast) => {
  toastState = toastState.filter((it) => it.id !== toast.id);
  notifySubscribers();
};

const addToast = (toast: Toast) => {
  toastState = [...toastState, toast];
  notifySubscribers();
  if (!toast.promise && toast.duration) {
    delay(toast.duration).then(() => removeToast(toast));
  }
};

const updateToast = (toast: Toast) => {
  toastState = toastState.map((t) => {
    if (t.id === toast.id) {
      return toast;
    }
    return t;
  });
  notifySubscribers();
  delay(toast.duration ?? 3000).then(() => removeToast(toast));
};

const getDefaultToastValue = (): Pick<Toast, 'duration' | 'id'> => ({
  duration: 3000,
  id: genId(),
});

const subscribe = (callback: () => void) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

type CreateToast = (toast: Omit<Toast, 'intent' | 'id'>) => void;
type CreateToastPromise = (
  toast: Omit<Toast, 'intent' | 'id'> & { promise: () => Promise<unknown> }
) => void;

type ToastHandler = {
  publish: (t: Toast) => void;
  success: CreateToast;
  info: CreateToast;
  promise: CreateToastPromise;
};

const handler: ToastHandler = {
  publish(toast: Toast) {
    addToast(toast);
  },
  success(t) {
    addToast({ ...getDefaultToastValue(), intent: 'success', ...t });
  },
  info(t) {
    addToast({ ...getDefaultToastValue(), intent: 'info', ...t });
  },
  promise(t) {
    const toast = {
      ...getDefaultToastValue(),
      intent: 'loading',
      ...t,
    } as Toast;
    
    addToast(toast);

    t.promise()
      .then(() => {
        const updatedToast = {
          ...toast,
          promise: undefined,
          intent: 'success',
        } as Toast;
        updateToast(updatedToast);
      })
      .catch(() => {
        const updatedToast = {
          ...toast,
          promise: undefined,
          intent: 'error',
        } as Toast;
        updateToast(updatedToast);
      });
  },
};

export const useToastStore = () => {
  const toasts = useSyncExternalStore(
    subscribe,
    () => toastState,
    () => []
  );

  return toasts;
};

export const useToast = () => {
  return handler;
};
