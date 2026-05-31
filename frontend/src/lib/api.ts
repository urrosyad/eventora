import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle dynamic response failures (401, 403)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      if (response.status === 401) {
        // Unauthenticated - clear store and force redirect to login
        useAuthStore.getState().clearAuth();
        // Only redirect if we are not already on the login or landing page
        const pathname = window.location.pathname;
        if (pathname !== "/login" && pathname !== "/register" && pathname !== "/" && pathname !== "/home") {
          window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
        }
      } else if (response.status === 403) {
        // Forbidden - redirect to 403 page
        if (window.location.pathname !== "/403") {
          window.location.href = "/403";
        }
      }
    }

    return Promise.reject(error);
  }
);
