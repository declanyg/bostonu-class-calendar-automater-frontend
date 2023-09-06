import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from "@material-tailwind/react";

import './index.css';
import App from './App/App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <GoogleOAuthProvider clientId='700310009078-nu2qqnmocu3g5i3rupjvd2cjqs02n7n3.apps.googleusercontent.com'>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    {/* <App /> */}
  </GoogleOAuthProvider>
  </ThemeProvider>
);