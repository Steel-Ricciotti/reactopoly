// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Use createRoot instead of render
import App from './App';

const root = createRoot(document.getElementById('root')); // Create a root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);