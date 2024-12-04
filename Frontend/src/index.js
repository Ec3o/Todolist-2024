import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// 获取根节点并渲染应用
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
