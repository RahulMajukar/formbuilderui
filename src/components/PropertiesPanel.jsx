// File: /src/components/PropertiesPanel.js
import React, { useState } from 'react';
import { X, Plus, Minus, AlertCircle } from 'lucide-react';

const PropertiesPanel = ({ field, onUpdate, onClose }) => {
  const [options, setOptions] = useState(field.options || []);

  const handleUpdate = (property, value) => {
    onUpdate({ [property]: value });
  };

  const handleOptionsUpdate = (newOptions) => {
    setOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    handleOptionsUpdate(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    handleOptionsUpdate(newOptions);
  };

  const updateOption = (index, value) => {
    const newOptions = options.map((option, i) => i === index ? value : option);
    handleOptionsUpdate(newOptions);
  };

  const hasOptions = ['dropdown', 'radio', 'checkbox'].includes(field.type);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Field Properties</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Properties */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Basic Properties</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Label
              </label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleUpdate('label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {field.type !== 'section' && field.type !== 'page' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => handleUpdate('placeholder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Help Text
                  </label>
                  <textarea
                    value={field.helpText || ''}
                    onChange={(e) => handleUpdate('helpText', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Additional information for users"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={field.required}
                    onChange={(e) => handleUpdate('required', e.target.checked)}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                    Required field
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Options for dropdown, radio, checkbox */}
        {hasOptions && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Options</h4>
            
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <button
                onClick={addOption}
                className="flex items-center space-x-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-primary-400 hover:bg-primary-50 transition-colors"
              >
                <Plus className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Add Option</span>
              </button>
            </div>
          </div>
        )}

        {/* Validation Rules */}
        {field.type !== 'section' && field.type !== 'page' && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Validation</h4>
            
            <div className="space-y-4">
              {field.type === 'text' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Length
                    </label>
                    <input
                      type="number"
                      value={field.validation?.minLength || ''}
                      onChange={(e) => handleUpdate('validation', { 
                        ...field.validation, 
                        minLength: parseInt(e.target.value) || undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Length
                    </label>
                    <input
                      type="number"
                      value={field.validation?.maxLength || ''}
                      onChange={(e) => handleUpdate('validation', { 
                        ...field.validation, 
                        maxLength: parseInt(e.target.value) || undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </>
              )}

              {field.type === 'number' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Value
                    </label>
                    <input
                      type="number"
                      value={field.validation?.min || ''}
                      onChange={(e) => handleUpdate('validation', { 
                        ...field.validation, 
                        min: parseInt(e.target.value) || undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Value
                    </label>
                    <input
                      type="number"
                      value={field.validation?.max || ''}
                      onChange={(e) => handleUpdate('validation', { 
                        ...field.validation, 
                        max: parseInt(e.target.value) || undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {field.type === 'file' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accepted File Types
                    </label>
                    <input
                      type="text"
                      value={field.validation?.accept || ''}
                      onChange={(e) => handleUpdate('validation', { 
                        ...field.validation, 
                        accept: e.target.value 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder=".pdf,.doc,.docx"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      value={field.validation?.maxSize || ''}
                      onChange={(e) => handleUpdate('validation', { 
                        ...field.validation, 
                        maxSize: parseInt(e.target.value) || undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Field Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <div className="text-xs font-medium text-gray-700">Field ID</div>
              <div className="text-xs text-gray-500 font-mono">{field.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;