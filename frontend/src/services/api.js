import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
    baseURL: 'http://localhost:8081/api/v1',
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
        // ONLY redirect on 401 (Unauthorized). 
        // 401 means the token is invalid, expired, or missing.
        // 403 means "Forbidden" (you have a token, but lack permission). We should NOT logout on 403.
        if (error.response && error.response.status === 401) {
            const isAuthRequest = error.config && error.config.url.includes('/auth/');

            // Don't auto-logout if we are actively trying to log in
            if (!isAuthRequest) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
