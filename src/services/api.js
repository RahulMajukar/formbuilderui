// File: /src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

export const formService = {
  // Get all forms
  getAllForms: async () => {
    try {
      const response = await api.get('/forms');
      return response.data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw new Error('Failed to fetch forms');
    }
  },

  // Get a single form by ID
  getForm: async (id) => {
    try {
      const response = await api.get(`/forms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
      throw new Error(`Failed to fetch form with ID: ${id}`);
    }
  },

  // Create a new form
  createForm: async (formData) => {
    try {
      // Ensure fields is properly formatted
      const payload = {
        title: formData.title || 'Untitled Form',
        description: formData.description || '',
        fields: formData.fields || [],
        status: 'DRAFT'
      };
      
      console.log('Creating form with payload:', payload);
      const response = await api.post('/forms', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating form:', error);
      throw new Error('Failed to create form');
    }
  },

  // Update an existing form
  updateForm: async (id, formData) => {
    try {
      // Ensure fields is properly formatted
      const payload = {
        title: formData.title || 'Untitled Form',
        description: formData.description || '',
        fields: formData.fields || [],
        status: formData.status || 'DRAFT'
      };
      
      console.log('Updating form with payload:', payload);
      const response = await api.put(`/forms/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating form:', error);
      throw new Error(`Failed to update form with ID: ${id}`);
    }
  },

  // Delete a form
  deleteForm: async (id) => {
    try {
      await api.delete(`/forms/${id}`);
    } catch (error) {
      console.error('Error deleting form:', error);
      throw new Error(`Failed to delete form with ID: ${id}`);
    }
  },

  // Submit form data
  submitForm: async (formId, submissionData) => {
    try {
      const response = await api.post(`/forms/${formId}/submissions`, submissionData);
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw new Error('Failed to submit form');
    }
  },

  // Get form submissions
  getSubmissions: async (formId) => {
    try {
      const response = await api.get(`/forms/${formId}/submissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw new Error(`Failed to fetch submissions for form ID: ${formId}`);
    }
  },

  // Get submission analytics
  getAnalytics: async (formId) => {
    try {
      const response = await api.get(`/forms/${formId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error(`Failed to fetch analytics for form ID: ${formId}`);
    }
  }
};

export default api;