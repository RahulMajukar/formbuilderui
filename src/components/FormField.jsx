// File: /src/components/FormField.js
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Trash2, GripVertical, AlertCircle } from 'lucide-react';

const FormField = ({ 
  field, 
  index, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete, 
  onMove,
  viewMode 
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'EXISTING_FIELD',
    item: { id: field.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'EXISTING_FIELD',
    hover: (item, monitor) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      
      onMove(item.id, hoverIndex);
      item.index = hoverIndex;
    },
  }));

  drag(drop(ref));

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(field.id);
  };

  const renderField = () => {
    const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent";
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={baseInputClasses}
            disabled
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder || "Enter number"}
            className={baseInputClasses}
            disabled
          />
        );
        
      case 'date':
        return (
          <input
            type="date"
            className={baseInputClasses}
            disabled
          />
        );
        
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || "Enter text"}
            rows="4"
            className={baseInputClasses}
            disabled
          />
        );
        
      case 'file':
        return (
          <div className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-center">
            <div className="text-gray-500">Click to upload or drag and drop</div>
          </div>
        );
        
      case 'dropdown':
        return (
          <select className={baseInputClasses} disabled>
            <option>Select an option</option>
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
                <input type="radio" name={field.id} disabled className="text-primary-600" />
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
                <input type="checkbox" disabled className="text-primary-600" />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'section':
        return <hr className="border-gray-300" />;
        
      case 'page':
        return (
          <div className="w-full border-t-2 border-dashed border-gray-400 pt-4">
            <div className="text-center text-gray-500 text-sm">Page Break</div>
          </div>
        );
        
      default:
        return <div className="text-gray-400">Unknown field type</div>;
    }
  };

  return (
    <div
      ref={ref}
      className={`form-field mb-6 p-4 rounded-lg transition-all duration-200 ${
        isSelected ? 'selected' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <button
            onClick={handleDelete}
            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </button>
          <div className="p-1 bg-gray-500 text-white rounded-full cursor-move">
            <GripVertical className="h-3 w-3" />
          </div>
        </div>
      )}
      
      {field.type !== 'section' && field.type !== 'page' && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.helpText && (
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <AlertCircle className="h-3 w-3 mr-1" />
              {field.helpText}
            </div>
          )}
        </div>
      )}
      
      {renderField()}
    </div>
  );
};

export default FormField;