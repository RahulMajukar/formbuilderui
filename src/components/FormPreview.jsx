// File: /src/components/FormPreview.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { formService } from '../services/api';

const FormPreview = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm();

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = async () => {
    try {
      const form = await formService.getForm(id);
      setFormData(form);
    } catch (error) {
      setError('Form not found');
      console.error('Error loading form:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await formService.submitForm(id, data);
      setSubmitted(true);
    } catch (error) {
      setError('Failed to submit form');
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const baseInputClasses = "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors";
    const errorClasses = errors[field.id] ? "border-red-500" : "border-gray-300";
    
    const validation = {
      required: field.required && `${field.label} is required`,
      ...field.validation
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            {...register(field.id, validation)}
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={`${baseInputClasses} ${errorClasses}`}
          />
        );
        
      case 'number':
        return (
          <input
            {...register(field.id, {
              ...validation,
              valueAsNumber: true
            })}
            type="number"
            placeholder={field.placeholder || "Enter number"}
            className={`${baseInputClasses} ${errorClasses}`}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
        
      case 'date':
        return (
          <input
            {...register(field.id, validation)}
            type="date"
            className={`${baseInputClasses} ${errorClasses}`}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            {...register(field.id, validation)}
            placeholder={field.placeholder || "Enter text"}
            rows="4"
            className={`${baseInputClasses} ${errorClasses}`}
          />
        );
        
      case 'file':
        return (
          <input
            {...register(field.id, validation)}
            type="file"
            className={`${baseInputClasses} ${errorClasses}`}
            accept={field.validation?.accept}
          />
        );
        
      case 'dropdown':
        return (
          <select
            {...register(field.id, validation)}
            className={`${baseInputClasses} ${errorClasses}`}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
        
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input
                  {...register(field.id, validation)}
                  type="radio"
                  value={option}
                  className="text-primary-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input
                  {...register(`${field.id}.${idx}`)}
                  type="checkbox"
                  value={option}
                  className="text-primary-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'section':
        return <hr className="border-gray-300 my-6" />;
        
      case 'page':
        return (
          <div className="w-full border-t-2 border-dashed border-gray-400 pt-4 my-6">
            <div className="text-center text-gray-500 text-sm">Page Break</div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your form has been submitted successfully. We'll get back to you soon.
          </p>
          <button
            onClick={() => window.close()}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Form Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{formData.title}</h1>
            {formData.description && (
              <p className="mt-2 text-gray-600">{formData.description}</p>
            )}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">
            {formData.fields?.map((field) => (
              <div key={field.id}>
                {field.type !== 'section' && field.type !== 'page' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.helpText && (
                      <p className="text-xs text-gray-500 mb-2">{field.helpText}</p>
                    )}
                    
                    {renderField(field)}
                    
                    {errors[field.id] && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors[field.id].message}
                      </p>
                    )}
                  </div>
                )}
                
                {(field.type === 'section' || field.type === 'page') && renderField(field)}
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Form
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;