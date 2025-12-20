import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import './index.css'
import App from './App.tsx'

// Initialize theme attribute on document root
const initializeTheme = () => {
  // Default to light theme
  const defaultTheme = 'light';
  document.documentElement.setAttribute('data-theme', defaultTheme);
};

initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
