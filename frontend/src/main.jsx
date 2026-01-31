import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { App as AntdApp } from 'antd'; // ← Thêm dòng này

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AntdApp>  {/* ← Wrap toàn bộ app */}
      <App />
    </AntdApp>
  </React.StrictMode>
);