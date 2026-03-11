import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // If the URL is for an action like saving or liking, skip the redirect so the local catch handles it (showing toast to partner)
      if (error.config?.url?.includes('/like') || error.config?.url?.includes('/save')) {
        return Promise.reject(error);
      }

      // If the user gets a 401 (Unauthorized) and they are not already on an auth page, redirect them.
      const authPaths = ['/', '/login', '/register', '/partner/login', '/partner/register'];
      if (!authPaths.includes(window.location.pathname)) {
        localStorage.removeItem('role');
        localStorage.removeItem('partnerId');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <App />
)
