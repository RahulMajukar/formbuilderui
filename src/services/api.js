// File: /src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const formService = {
  // Get all forms
  getAllForms: async () => {
    const response = await api.get('/forms');
    return response.data;
  },

  // Get a single form by ID
  getForm: async (id) => {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },

  // Create a new form
  createForm: async (formData) => {
    const response = await api.post('/forms', formData);
    return response.data;
  },

  // Update an existing form
  updateForm: async (id, formData) => {
    const response = await api.put(`/forms/${id}`, formData);
    return response.data;
  },

  // Delete a form
  deleteForm: async (id) => {
    await api.delete(`/forms/${id}`);
  },

  // Submit form data
  submitForm: async (formId, submissionData) => {
    const response = await api.post(`/forms/${formId}/submissions`, submissionData);
    return response.data;
  },

  // Get form submissions
  getSubmissions: async (formId) => {
    const response = await api.get(`/forms/${formId}/submissions`);
    return response.data;
  },

  // Get submission analytics
  getAnalytics: async (formId) => {
    const response = await api.get(`/forms/${formId}/analytics`);
    return response.data;
  }
};

export default api;