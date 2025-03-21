import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true // Enable sending cookies
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Get current path
    const currentPath = window.location.pathname;
    
    // Skip auth redirect for these paths
    const publicPaths = [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password'
    ];

    if (error.response?.status === 401 && !publicPaths.includes(currentPath)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default instance;