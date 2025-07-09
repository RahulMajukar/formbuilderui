// File: /src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Plus, List } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/forms" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">FormBuilder</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/forms"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/forms') && !isActive('/form-builder')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:block">All Forms</span>
            </Link>
            
            <Link
              to="/form-builder"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/form-builder')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:block">New Form</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;