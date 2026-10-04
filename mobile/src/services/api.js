import axios from 'axios';
import { getToken } from '../utils/storage';

// NOTE: Use your laptop's local LAN IP for physical Android device testing.
// localhost/127.0.0.1 on the phone refers to the phone itself, NOT your laptop!
// export const API_BASE_URL = 'https://taskly-backend-nu.vercel.app/api'
export const API_BASE_URL = 'http://192.168.100.167:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Automatically attach Bearer token to all outgoing requests
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to extract user-friendly error messages
export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.request) {
    return 'Unable to reach backend server. Please verify your phone and laptop are on the same Wi-Fi and the backend is running.';
  }
  return error.message || 'An unexpected error occurred';
};

export default api;
