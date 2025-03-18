import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Import Bootstrap for styling

/**
 * Main Entry Point of the Application
 *
 * This file:
 * - Uses **React StrictMode** to highlight potential issues in development.
 * - Mounts the **App component** to the root of the DOM.
 * - Imports **Bootstrap CSS** for global styling.
 */

// ✅ Create and render the React application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
