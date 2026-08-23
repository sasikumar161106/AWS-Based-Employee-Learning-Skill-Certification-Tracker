import axios from 'axios';

const useApi = import.meta.env.VITE_USE_API === 'true';
const sharedBaseUrl = import.meta.env.VITE_API_BASE_URL;

const createApiClient = (baseURL: string) => axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const addAuthInterceptor = (client: ReturnType<typeof createApiClient>) => {
  client.interceptors.request.use((config) => {
  if (!useApi) {
    return config;
  }

  const token = localStorage.getItem('lms_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
  });
  return client;
};

export const api = addAuthInterceptor(createApiClient(
  import.meta.env.VITE_COURSE_API_BASE_URL || sharedBaseUrl
));

export const quizApi = addAuthInterceptor(createApiClient(
  import.meta.env.VITE_QUIZ_API_BASE_URL || sharedBaseUrl
));

export const isApiEnabled = () => useApi;