import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store'; // ⬅️ import persistor
import { PersistGate } from 'redux-persist/integration/react'; // ⬅️ import PersistGate

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <Toaster />
  </React.StrictMode>
);
