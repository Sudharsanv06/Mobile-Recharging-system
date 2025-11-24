import { toast as hotToast } from 'react-hot-toast';

/**
 * Small compatibility wrapper so existing code can import `{ toast }` from this module.
 * Use react-hot-toast under the hood.
 */
export const showToast = (message, type = 'success', duration = 4000) => {
  if (type === 'success') hotToast.success(message, { duration });
  else if (type === 'error') hotToast.error(message, { duration });
  else if (type === 'warning') hotToast(message, { duration, icon: '⚠️' });
  else hotToast(message, { duration });
};

export const toast = {
  success: (message, duration) => hotToast.success(message, { duration }),
  error: (message, duration) => hotToast.error(message, { duration }),
  warning: (message, duration) => hotToast(message, { duration, icon: '⚠️' }),
  info: (message, duration) => hotToast(message, { duration }),
};

export default hotToast;
