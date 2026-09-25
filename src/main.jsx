import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { WhiteboardProvider } from './context/WhiteboardContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WhiteboardProvider>
        <App />
      </WhiteboardProvider>
    </AuthProvider>
  </StrictMode>,
)


