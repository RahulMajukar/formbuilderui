// File: /src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 second timeout
  withCredentials: false,
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
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      params: config.params,
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
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    return Promise.reject(error);
  }
);

export const formService = {
  // Test endpoint to verify connectivity
  test: async () => {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error) {
      console.error('Test endpoint failed:', error);
      throw new Error('Backend connection failed');
    }
  },

  // Get all forms with optional pagination and search
  getAllForms: async (params = {}) => {
    try {
      console.log('Fetching forms with params:', params);
      const response = await api.get('/forms', { params });
      console.log('Forms fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw new Error(`Failed to fetch forms: ${error.message}`);
    }
  },

  // Get forms with pagination, search, and filtering
  getFormsPaginated: async ({ 
    page = 0, 
    size = 10, 
    search = '', 
    status = '', 
    sortBy = 'updatedAt', 
    sortDirection = 'desc' 
  } = {}) => {
    try {
      const params = {
        page,
        size,
        ...(search && { search }),
        ...(status && { status }),
        sortBy,
        sortDirection
      };
      
      console.log('Fetching paginated forms with params:', params);
      const response = await api.get('/forms/paginated', { params });
      console.log('Paginated forms fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated forms:', error);
      throw new Error(`Failed to fetch forms: ${error.message}`);
    }
  },

  // Get a single form by ID
  getForm: async (id) => {
    try {
      console.log(`Fetching form with ID: ${id}`);
      const response = await api.get(`/forms/${id}`);
      console.log('Form fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
      if (error.response?.status === 404) {
        throw new Error(`Form with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch form: ${error.message}`);
    }
  },

  // Create a new form
  createForm: async (formData) => {
    try {
      // Ensure fields is properly formatted
      const payload = {
        title: formData.title || 'Untitled Form',
        description: formData.description || '',
        fields: Array.isArray(formData.fields) ? formData.fields : [],
        status: 'DRAFT'
      };
      
      console.log('Creating form with payload:', payload);
      const response = await api.post('/forms', payload);
      console.log('Form created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating form:', error);
      throw new Error(`Failed to create form: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update an existing form
  updateForm: async (id, formData) => {
    try {
      // Ensure fields is properly formatted
      const payload = {
        title: formData.title || 'Untitled Form',
        description: formData.description || '',
        fields: Array.isArray(formData.fields) ? formData.fields : [],
        status: formData.status || 'DRAFT'
      };
      
      console.log(`Updating form ${id} with payload:`, payload);
      const response = await api.put(`/forms/${id}`, payload);
      console.log('Form updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating form:', error);
      if (error.response?.status === 404) {
        throw new Error(`Form with ID ${id} not found`);
      }
      throw new Error(`Failed to update form: ${error.response?.data?.message || error.message}`);
    }
  },

  // Delete a form
  deleteForm: async (id) => {
    try {
      console.log(`Deleting form with ID: ${id}`);
      await api.delete(`/forms/${id}`);
      console.log('Form deleted successfully');
    } catch (error) {
      console.error('Error deleting form:', error);
      if (error.response?.status === 404) {
        throw new Error(`Form with ID ${id} not found`);
      }
      throw new Error(`Failed to delete form: ${error.message}`);
    }
  },

  // Bulk delete forms
  bulkDeleteForms: async (formIds) => {
    try {
      console.log(`Bulk deleting forms:`, formIds);
      const response = await api.delete('/forms/bulk', { data: { formIds } });
      console.log('Forms deleted successfully');
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting forms:', error);
      throw new Error(`Failed to delete forms: ${error.message}`);
    }
  },

  // Bulk duplicate forms
  bulkDuplicateForms: async (formIds) => {
    try {
      console.log(`Bulk duplicating forms:`, formIds);
      const response = await api.post('/forms/bulk/duplicate', { formIds });
      console.log('Forms duplicated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error bulk duplicating forms:', error);
      throw new Error(`Failed to duplicate forms: ${error.message}`);
    }
  },

  // Submit form data
  submitForm: async (formId, submissionData) => {
    try {
      console.log(`Submitting form ${formId} with data:`, submissionData);
      const response = await api.post(`/forms/${formId}/submissions`, submissionData);
      console.log('Form submitted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw new Error(`Failed to submit form: ${error.message}`);
    }
  },

  // Get form submissions
  getSubmissions: async (formId) => {
    try {
      console.log(`Fetching submissions for form ${formId}`);
      const response = await api.get(`/forms/${formId}/submissions`);
      console.log('Submissions fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw new Error(`Failed to fetch submissions: ${error.message}`);
    }
  },

  // Get submission analytics
  getAnalytics: async (formId) => {
    try {
      console.log(`Fetching analytics for form ${formId}`);
      const response = await api.get(`/forms/${formId}/analytics`);
      console.log('Analytics fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error(`Failed to fetch analytics: ${error.message}`);
    }
  },

  // Search forms
  searchForms: async (searchTerm) => {
    try {
      console.log(`Searching forms with term: ${searchTerm}`);
      const response = await api.get('/forms/search', { params: { q: searchTerm } });
      console.log('Search completed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching forms:', error);
      throw new Error(`Failed to search forms: ${error.message}`);
    }
  }
};

export default api;