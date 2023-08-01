import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from "react-router-dom"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="190541474326-dhb8n9vuv9vbd81b9qdit1s0849un5pj.apps.googleusercontent.com">
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

