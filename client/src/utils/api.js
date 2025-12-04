import axios from 'axios';
import { toast } from './toast';

// Determine API base: prefer Vite env var VITE_API_URL, fallback to localhost in dev
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

// Track recent error toasts to prevent duplicates
const recentErrors = new Map();
const ERROR_DEBOUNCE_MS = 3000; // Don't show same error within 3 seconds

const showErrorToast = (message, key = message) => {
	const now = Date.now();
	const lastShown = recentErrors.get(key);
	
	if (!lastShown || (now - lastShown) > ERROR_DEBOUNCE_MS) {
		toast.error(message);
		recentErrors.set(key, now);
	}
};

const api = axios.create({
	baseURL: API_BASE,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

// Request: attach token when present
api.interceptors.request.use((config) => {
	try {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = `Bearer ${token}`;
		}
	} catch (e) {
		// ignore localStorage errors
	}
	return config;
}, (error) => Promise.reject(error));

// Response: handle common error cases
api.interceptors.response.use(
	(resp) => resp,
	(error) => {
		// Ignore cancelled requests (AbortController)
		if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError' || error.name === 'AbortError') {
			return Promise.reject(error);
		}

		if (!error.response) {
			// Network / CORS error - but don't spam toasts
			// Only show if this is a user-initiated action (not background refresh)
			// Components should handle their own error display for critical operations
			console.warn('Network error:', error.message);
			
			// Only show toast for explicit network failures, not for every background request
			if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
				toast.error('Request timeout — please try again');
			}
			// Don't show generic "Network error" toast - let components handle it
			return Promise.reject(error);
		}

		const { status, data } = error.response;

		if (status === 401) {
			// trigger global auth invalidation
			try {
				localStorage.removeItem('token');
			} catch (e) {}
			window.dispatchEvent(new Event('auth:invalid'));
			showErrorToast('Session expired — please log in again', 'auth:401');
			return Promise.reject(error);
		}

		// For server errors show a toast with message when available
		const msg = data?.message || data?.msg || data?.error;
		if (status >= 500) {
			showErrorToast('Server error — try again later', 'server:500');
		} else if (status >= 400 && msg) {
			// Only show client errors with meaningful messages
			showErrorToast(msg, `client:${status}:${msg}`);
		}

		return Promise.reject(error);
	}
);

export default api;
