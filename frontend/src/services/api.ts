import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.0.9:5000/api'; // Corrected IP from ipconfig
console.log('API_URL initialized:', API_URL);

const api = axios.create({
    baseURL: API_URL,
});

// Health check on startup
api.get('/health')
    .then(res => console.log('Backend connection successful:', res.data))
    .catch(err => console.error('Backend connection failed:', err.message));

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
