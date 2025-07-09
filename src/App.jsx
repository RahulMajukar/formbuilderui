// File: /src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormBuilder from './components/FormBuilder';
import FormsList from './components/FormsList';
import FormPreview from './components/FormPreview';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/forms" replace />} />
            <Route path="/forms" element={<FormsList />} />
            <Route path="/form-builder/:id?" element={<FormBuilder />} />
            <Route path="/form/:id" element={<FormPreview />} />
          </Routes>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;