/**
 * Utility function to show toast notifications
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
export const showToast = (message, type = 'success', duration = 4000) => {
  const event = new CustomEvent('app-show-toast', {
    detail: { message, type, duration }
  });
  window.dispatchEvent(event);
};

// Convenience methods
export const toast = {
  success: (message, duration) => showToast(message, 'success', duration),
  error: (message, duration) => showToast(message, 'error', duration),
  warning: (message, duration) => showToast(message, 'warning', duration),
  info: (message, duration) => showToast(message, 'info', duration),
};
