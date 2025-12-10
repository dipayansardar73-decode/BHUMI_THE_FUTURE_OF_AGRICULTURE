
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("App starting...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Failed to find root element");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App mounted successfully");
} catch (error) {
  console.error("Error mounting app:", error);
}
