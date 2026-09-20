import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootMountElement = document.getElementById('root');

if (rootMountElement) {
  ReactDOM.createRoot(rootMountElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
