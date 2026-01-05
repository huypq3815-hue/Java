import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ConfigProvider } from 'antd';
import ErrorBoundary from './components/common/ErrorBoundary';

const theme = {
  token: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    colorPrimary: '#1890ff',
    borderRadius: 8,
    colorBgLayout: '#f0f2f5',
  },
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Không tìm thấy element #root trong HTML');
}

createRoot(container).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </ErrorBoundary>
  </React.StrictMode>
);