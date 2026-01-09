import { toast as sonnerToast } from 'sonner';

export const showSuccess = (message: string, options?: any) => {
  return sonnerToast.success(message, {
    duration: 5000,
    className: 'glass-panel border-emerald-500/20',
    ...options
  });
};

export const showError = (message: string, options?: any) => {
  return sonnerToast.error(message, {
    duration: 6000,
    className: 'glass-panel border-rose-500/20',
    ...options
  });
};

export const showInfo = (message: string, options?: any) => {
  return sonnerToast.info(message, {
    duration: 4000,
    className: 'glass-panel border-blue-500/20',
    ...options
  });
};

export const showAlert = (title: string, options?: any) => {
  return sonnerToast(title, {
    duration: 7000,
    className: 'glass-panel border-violet-500/20',
    icon: '🎯',
    ...options
  });
};
