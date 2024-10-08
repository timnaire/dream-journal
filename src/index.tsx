import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { appRoutes } from './AppRouting';
import { AppContextProvider } from './core/context/AppContext';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import Store from './core/store/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <CssBaseline />
    <AppContextProvider>
      <Provider store={Store}>
        <RouterProvider router={appRoutes} />
      </Provider>
    </AppContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
