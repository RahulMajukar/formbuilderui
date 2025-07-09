// File: /src/components/FormsList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit3, 
  Eye, 
  Trash2, 
  Copy, 
  FileText,
  Calendar,
  BarChart3
} from 'lucide-react';
import { formService } from '../services/api';

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const formsData = await formService.getAllForms();
      setForms(formsData);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    try {
      await formService.deleteForm(formId);
      setForms(forms.filter(form => form.id !== formId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const handleDuplicate = async (form) => {
    try {
      const duplicatedForm = {
        ...form,
        title: `${form.title} (Copy)`,
        id: undefined
      };
      const newForm = await formService.createForm(duplicatedForm);
      setForms([newForm, ...forms]);
    } catch (error) {
      console.error('Error duplicating form:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage your forms
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/form-builder"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Form
          </Link>
        </div>
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new form.
          </p>
          <div className="mt-6">
            <Link
              to="/form-builder"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {form.title}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleDuplicate(form)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(form.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {form.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {form.description}
                  </p>
                )}

                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {form.fields?.length || 0} fields
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(form.updatedAt || form.createdAt)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Link
                      to={`/form-builder/${form.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Link>
                    <Link
                      to={`/form/${form.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Link>
                  </div>
                  
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-800"
                    title="View Analytics"
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Delete Form
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this form? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsList;