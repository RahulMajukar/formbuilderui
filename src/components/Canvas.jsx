// File: /src/components/Canvas.js
import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import FormField from './FormField';

const Canvas = ({ 
  fields, 
  selectedField, 
  onSelectField, 
  onUpdateField, 
  onDeleteField, 
  onMoveField,
  viewMode 
}) => {
  const canvasRef = useRef(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FORM_FIELD',
    drop: (item, monitor) => {
      if (item.fieldType) {
        // This is a new field from sidebar
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const dropPosition = monitor.getClientOffset();
        const relativePosition = {
          x: dropPosition.x - canvasRect.left,
          y: dropPosition.y - canvasRect.top
        };
        
        // Add field at drop position
        const newField = {
          id: Date.now().toString(),
          type: item.fieldType,
          label: `${item.fieldType.charAt(0).toUpperCase() + item.fieldType.slice(1)} Field`,
          placeholder: '',
          required: false,
          helpText: '',
          options: item.fieldType === 'dropdown' || item.fieldType === 'radio' || item.fieldType === 'checkbox' 
            ? ['Option 1', 'Option 2'] : [],
          validation: {},
          position: relativePosition
        };
        
        // This would need to be passed from parent
        if (window.addFieldCallback) {
          window.addFieldCallback(newField);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      onSelectField(null);
    }
  };

  const getCanvasClasses = () => {
    const baseClasses = "relative bg-white shadow-lg min-h-screen p-8 mx-auto";
    const hoverClasses = isOver ? "bg-blue-50 border-blue-300" : "";
    
    switch (viewMode) {
      case 'mobile':
        return `${baseClasses} ${hoverClasses} max-w-sm`;
      case 'tablet':
        return `${baseClasses} ${hoverClasses} max-w-2xl`;
      default:
        return `${baseClasses} ${hoverClasses} a4-canvas`;
    }
  };

  return (
    <div
      ref={(node) => {
        canvasRef.current = node;
        drop(node);
      }}
      className={`${getCanvasClasses()} drop-zone ${isOver ? 'drag-over' : ''}`}
      onClick={handleCanvasClick}
    >
      {fields.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-lg font-medium mb-2">Start building your form</div>
            <div className="text-sm">Drag form elements from the sidebar to begin</div>
          </div>
        </div>
      )}
      
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          field={field}
          index={index}
          isSelected={selectedField && selectedField.id === field.id}
          onSelect={() => onSelectField(field)}
          onUpdate={onUpdateField}
          onDelete={onDeleteField}
          onMove={onMoveField}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default Canvas;