// File: /src/components/FormBuilder.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, Download, Smartphone, Tablet, Monitor } from 'lucide-react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import { generatePDF } from '../utils/pdfGenerator';
import { formService } from '../services/api';

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: null,
    title: 'Untitled Form',
    description: '',
    fields: []
  });
  const [selectedField, setSelectedField] = useState(null);
  const [viewMode, setViewMode] = useState('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && id !== 'new') {
      loadForm(id);
    }
  }, [id]);

  const loadForm = async (formId) => {
    try {
      setError(null);
      const form = await formService.getForm(formId);
      console.log('Loaded form:', form);
      setFormData(form);
    } catch (error) {
      console.error('Error loading form:', error);
      setError('Failed to load form');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      console.log('Saving form data:', formData);
      
      let savedForm;
      if (formData.id) {
        savedForm = await formService.updateForm(formData.id, formData);
        console.log('Form updated successfully:', savedForm);
      } else {
        savedForm = await formService.createForm(formData);
        console.log('Form created successfully:', savedForm);
      }
      
      setFormData(savedForm);
      
      // Navigate to the edit page if this was a new form
      if (!formData.id && savedForm.id) {
        navigate(`/form-builder/${savedForm.id}`, { replace: true });
      }
      
    } catch (error) {
      console.error('Error saving form:', error);
      setError(`Failed to save form: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (formData.id) {
      window.open(`/form/${formData.id}`, '_blank');
    } else {
      alert('Please save the form first');
    }
  };

  const handleExportPDF = () => {
    try {
      generatePDF(formData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
    }
  };

  const addField = (newField) => {
    console.log('Adding field:', newField);
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    
    setSelectedField(newField);
  };

  const addFieldByType = (fieldType) => {
    const fieldId = `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newField = {
      id: fieldId,
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: getDefaultPlaceholder(fieldType),
      required: false,
      helpText: '',
      options: ['dropdown', 'radio', 'checkbox'].includes(fieldType) 
        ? ['Option 1', 'Option 2'] : [],
      validation: {},
      position: { x: 50, y: formData.fields.length * 80 + 50 }
    };

    addField(newField);
  };

  const getDefaultPlaceholder = (fieldType) => {
    const placeholders = {
      text: 'Enter text here...',
      email: 'Enter your email address...',
      number: 'Enter a number...',
      phone: 'Enter your phone number...',
      date: '',
      textarea: 'Enter your message...',
      file: '',
      dropdown: '',
      radio: '',
      checkbox: '',
      section: '',
      page: ''
    };
    return placeholders[fieldType] || '';
  };

  const updateField = (fieldId, updates) => {
    console.log('Updating field:', fieldId, updates);
    
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
    
    if (selectedField && selectedField.id === fieldId) {
      setSelectedField(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteField = (fieldId) => {
    console.log('Deleting field:', fieldId);
    
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    
    if (selectedField && selectedField.id === fieldId) {
      setSelectedField(null);
    }
  };

  const moveField = (fieldId, newPosition) => {
    updateField(fieldId, { position: newPosition });
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full text-lg font-semibold bg-transparent border-none outline-none"
            placeholder="Form Title"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full mt-2 text-sm text-gray-600 bg-transparent border-none outline-none resize-none"
            placeholder="Form description..."
            rows="2"
          />
        </div>
        <Sidebar onAddField={addFieldByType} />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                  title="Desktop View"
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('tablet')}
                  className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
                  title="Tablet View"
                >
                  <Tablet className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                  title="Mobile View"
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
              
              <button
                onClick={handlePreview}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <div className={`mx-auto transition-all duration-300 ${getViewportClass()}`}>
            <Canvas
              fields={formData.fields}
              selectedField={selectedField}
              onSelectField={setSelectedField}
              onUpdateField={updateField}
              onDeleteField={deleteField}
              onMoveField={moveField}
              onAddField={addField}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedField && (
        <div className="w-80 bg-white shadow-sm border-l border-gray-200 overflow-y-auto">
          <PropertiesPanel
            field={selectedField}
            onUpdate={(updates) => updateField(selectedField.id, updates)}
            onClose={() => setSelectedField(null)}
          />
        </div>
      )}
    </div>
  );
};

export default FormBuilder;