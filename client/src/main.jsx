import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './utils/api';
import './index.css';
import './animations.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/authContext';
import { SocketProvider } from './contexts/socketContext';
import AppErrorBoundary from './components/AppErrorBoundary';


const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppErrorBoundary>
            <App />
          </AppErrorBoundary>
          <Toaster position="top-right" />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);