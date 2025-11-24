import axios from 'axios';
import { toast } from './toast';

// Determine API base: prefer Vite env var, fallback to localhost in dev
const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:5000' : '');

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
		if (!error.response) {
			// Network / CORS error
			toast.error('Network error — please check your connection');
			return Promise.reject(error);
		}

		const { status, data } = error.response;

		if (status === 401) {
			// trigger global auth invalidation
			try {
				localStorage.removeItem('token');
			} catch (e) {}
			window.dispatchEvent(new Event('auth:invalid'));
			toast.error('Session expired — please log in again');
			return Promise.reject(error);
		}

		// For server errors show a toast with message when available
		const msg = data?.message || data?.msg || data?.error;
		if (status >= 500) toast.error('Server error — try again later');
		else if (msg) toast.error(msg);

		return Promise.reject(error);
	}
);

export default api;
