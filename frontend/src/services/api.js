import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    // Don't attach token for auth endpoints
    if (token && !config.url.includes('/auth/')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Redirect only on 401 (Unauthorized) which means token is invalid/expired.
        // 403 (Forbidden) means authenticated but no permission - DO NOT LOGOUT.
        if (error.response && error.response.status === 401) {
            const isAuthRequest = error.config && error.config.url.includes('/auth/');

            // Don't auto-logout if we are actively trying to log in
            if (!isAuthRequest) {
                console.warn("Session expired or invalid. Redirecting to login.");
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
