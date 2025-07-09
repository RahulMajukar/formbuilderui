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
  onAddField, // Add this prop
  viewMode
}) => {
  const canvasRef = useRef(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['FORM_FIELD', 'EXISTING_FIELD'],
    drop: (item, monitor) => {
      if (item.fieldType) {
        // This is a new field from sidebar
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const dropPosition = monitor.getClientOffset();
        
        if (!dropPosition) return;
        
        const relativePosition = {
          x: dropPosition.x - canvasRect.left,
          y: dropPosition.y - canvasRect.top
        };

        // Generate unique field ID
        const fieldId = `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create new field object
        const newField = {
          id: fieldId,
          type: item.fieldType,
          label: `${item.fieldType.charAt(0).toUpperCase() + item.fieldType.slice(1)} Field`,
          placeholder: getDefaultPlaceholder(item.fieldType),
          required: false,
          helpText: '',
          options: ['dropdown', 'radio', 'checkbox'].includes(item.fieldType) 
            ? ['Option 1', 'Option 2'] : [],
          validation: {},
          position: relativePosition
        };

        // Call the add field function
        if (onAddField) {
          onAddField(newField);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

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

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.closest('.canvas-background')) {
      onSelectField(null);
    }
  };

  const handleFieldMove = (fieldId, targetIndex) => {
    const currentIndex = fields.findIndex(f => f.id === fieldId);
    if (currentIndex === -1 || currentIndex === targetIndex) return;

    const newFields = [...fields];
    const [movedField] = newFields.splice(currentIndex, 1);
    newFields.splice(targetIndex, 0, movedField);

    // Update all fields with new positions
    newFields.forEach((field, index) => {
      onUpdateField(field.id, { position: { ...field.position, order: index } });
    });
  };

  const getCanvasClasses = () => {
    const baseClasses = "relative bg-white shadow-lg min-h-screen p-8 mx-auto border-2 border-dashed transition-colors";
    const borderClasses = isOver ? "border-blue-400 bg-blue-50" : "border-gray-300";
    
    switch (viewMode) {
      case 'mobile':
        return `${baseClasses} ${borderClasses} max-w-sm`;
      case 'tablet':
        return `${baseClasses} ${borderClasses} max-w-2xl`;
      default:
        return `${baseClasses} ${borderClasses} max-w-4xl`;
    }
  };

  return (
    <div
      ref={(node) => {
        canvasRef.current = node;
        drop(node);
      }}
      className={getCanvasClasses()}
      onClick={handleCanvasClick}
    >
      <div className="canvas-background absolute inset-0" />
      
      {fields.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            <div className="text-lg font-medium mb-2">Start building your form</div>
            <div className="text-sm">Drag form elements from the sidebar to begin</div>
          </div>
        </div>
      )}

      <div className="relative z-10 space-y-6">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            field={field}
            index={index}
            isSelected={selectedField && selectedField.id === field.id}
            onSelect={() => onSelectField(field)}
            onUpdate={(fieldId, updates) => onUpdateField(fieldId, updates)}
            onDelete={onDeleteField}
            onMove={handleFieldMove}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;