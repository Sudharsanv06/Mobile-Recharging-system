/**
 * Normalize recharge status to expected CSS class names
 * @param {string} status - The status from API (case-insensitive)
 * @returns {string} Normalized status class name
 */
export const getStatusClass = (status) => {
  if (!status) return 'pending';
  
  const normalized = status.toLowerCase().trim();
  
  // Map various status formats to standard classes
  const statusMap = {
    'success': 'success',
    'completed': 'success',
    'successful': 'success',
    'paid': 'success',
    'done': 'success',
    
    'failed': 'failed',
    'failure': 'failed',
    'error': 'failed',
    'declined': 'failed',
    'rejected': 'failed',
    
    'pending': 'pending',
    'processing': 'pending',
    'in-progress': 'pending',
    'initiated': 'pending',
    'waiting': 'pending',
  };
  
  return statusMap[normalized] || 'pending';
};

/**
 * Format status display text
 * @param {string} status - The status from API
 * @returns {string} Formatted status text
 */
export const getStatusText = (status) => {
  if (!status) return 'Pending';
  
  const normalized = status.toLowerCase().trim();
  
  const textMap = {
    'success': 'Success',
    'completed': 'Success',
    'successful': 'Success',
    'paid': 'Success',
    'done': 'Success',
    
    'failed': 'Failed',
    'failure': 'Failed',
    'error': 'Failed',
    'declined': 'Failed',
    'rejected': 'Failed',
    
    'pending': 'Pending',
    'processing': 'Processing',
    'in-progress': 'Processing',
    'initiated': 'Pending',
    'waiting': 'Pending',
  };
  
  return textMap[normalized] || status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Get status icon
 * @param {string} status - The status from API
 * @returns {string} Icon emoji or symbol
 */
export const getStatusIcon = (status) => {
  const statusClass = getStatusClass(status);
  
  const iconMap = {
    'success': '✓',
    'failed': '✕',
    'pending': '⏱',
  };
  
  return iconMap[statusClass] || '•';
};
