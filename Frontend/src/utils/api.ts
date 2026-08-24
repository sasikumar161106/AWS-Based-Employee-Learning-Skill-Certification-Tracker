import axios from 'axios';
import { cognito } from './cognito';

const useApi = import.meta.env.VITE_USE_API !== 'false';
const sharedBaseUrl = import.meta.env.VITE_API_BASE_URL;

const createApiClient = (baseURL: string) => axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const addAuthInterceptor = (client: ReturnType<typeof createApiClient>) => {
  client.interceptors.request.use(async (config) => {
  if (!useApi) {
    return config;
  }

  const session = await cognito.getSession();
  if (session) {
    config.headers.Authorization = cognito.getJwtToken(session);
  }

  return config;
  });
  return client;
};

export const api = addAuthInterceptor(createApiClient(
  import.meta.env.VITE_COURSE_API_BASE_URL || sharedBaseUrl || 'https://ddkho7ox7a.execute-api.ap-south-1.amazonaws.com/Prod'
));

export const quizApi = addAuthInterceptor(createApiClient(
  import.meta.env.VITE_QUIZ_API_BASE_URL || sharedBaseUrl || 'https://ddkho7ox7a.execute-api.ap-south-1.amazonaws.com/Prod'
));

export const isApiEnabled = () => useApi;