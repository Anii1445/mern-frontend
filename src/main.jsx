import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './store/auth-ContextAPI.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./css/toast.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter } from 'react-router-dom'
import {Provider} from "react-redux";
import { persistor, store } from './store/store.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import ScrollToTop from './pages/ScrollToTop.jsx'
{
  /* The following line can be included in your src/index.js or App.js file */
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
  <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <App />
        <ToastContainer />
      </BrowserRouter>
  </AuthProvider>
  </PersistGate>
   </Provider>
  </StrictMode>
)
