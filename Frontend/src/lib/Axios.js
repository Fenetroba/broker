import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/', // Change if your backend URL is different
  withCredentials: true, // Send cookies with requests
});

// Automatically refresh access token on 401 and retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and we haven't retried yet, attempt refresh
    if (error?.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh-token');
        // Retry the original request after successful refresh
        return api(originalRequest);
      } catch (refreshErr) {
        // If refresh fails, propagate the original error
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
