import axios from 'axios';
import { SERVER_ENDPOINT } from '../config-global';

const Interceptor = axios.create({
  baseURL: SERVER_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

Interceptor.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);
Interceptor.interceptors.response.use((res) => res);

export default Interceptor;