import axios from 'axios';

const useApi = import.meta.env.VITE_USE_API === 'true';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  if (!useApi) {
    return config;
  }

  const token = localStorage.getItem('lms_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const isApiEnabled = () => useApi;