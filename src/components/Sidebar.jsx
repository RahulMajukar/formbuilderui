// File: /src/components/Sidebar.js
import React from 'react';
import { useDrag } from 'react-dnd';
import {
  Type,
  FileText,
  Mail,
  Hash,
  Calendar,
  Phone,
  Upload,
  ChevronDown,
  Circle,
  Square,
  Minus,
  PackagePlus
} from 'lucide-react';

const fieldTypes = [
  {
    type: 'text',
    label: 'Text Input',
    icon: Type,
    description: 'Single line text input'
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: FileText,
    description: 'Multi-line text input'
  },
  {
    type: 'email',
    label: 'Email',
    icon: Mail,
    description: 'Email address input'
  },
  {
    type: 'number',
    label: 'Number',
    icon: Hash,
    description: 'Numeric input'
  },
  {
    type: 'date',
    label: 'Date',
    icon: Calendar,
    description: 'Date picker'
  },
  {
    type: 'phone',
    label: 'Phone',
    icon: Phone,
    description: 'Phone number input'
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: Upload,
    description: 'File upload field'
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: ChevronDown,
    description: 'Select dropdown'
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: Circle,
    description: 'Single choice options'
  },
  {
    type: 'checkbox',
    label: 'Checkboxes',
    icon: Square,
    description: 'Multiple choice options'
  },
  {
    type: 'section',
    label: 'Section Break',
    icon: Minus,
    description: 'Visual section separator'
  },
  {
    type: 'page',
    label: 'Page Break',
    icon: PackagePlus,
    description: 'Page break for multi-page forms'
  }
];

const DraggableItem = ({ fieldType, onAddField }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FORM_FIELD',
    item: { fieldType: fieldType.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const IconComponent = fieldType.icon;

  return (
    <div
      ref={drag}
      className={`sidebar-item drag-item ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onAddField(fieldType.type)}
    >
      <IconComponent className="h-5 w-5 text-gray-600" />
      <div className="flex-1">
        <div className="font-medium text-gray-900">{fieldType.label}</div>
        <div className="text-xs text-gray-500">{fieldType.description}</div>
      </div>
    </div>
  );
};

const Sidebar = ({ onAddField }) => {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
        Form Elements
      </h3>
      
      <div className="space-y-3">
        {fieldTypes.map((fieldType) => (
          <DraggableItem
            key={fieldType.type}
            fieldType={fieldType}
            onAddField={onAddField}
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Tips</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Drag elements to the canvas</li>
          <li>• Click on fields to edit properties</li>
          <li>• Use section breaks to organize</li>
          <li>• Test responsiveness with viewport toggles</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;