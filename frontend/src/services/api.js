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

export default api;
