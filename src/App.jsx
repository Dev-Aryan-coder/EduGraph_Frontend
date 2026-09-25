import React, { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/public/Home'
import AboutUs from './pages/public/AboutUs'
import Features from './pages/public/Features'
import Services from './pages/public/Services'
import ContactUs from './pages/public/ContactUs'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import ForgotPassword from './pages/auth/ForgotPassword'
import './App.css'

const VALID_TABS = [
  'home',
  'about',
  'features',
  'services',
  'contact',
  'login',
  'signup',
  'forgot-password'
]

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return VALID_TABS.includes(hash) ? hash : 'home'
  })

  // Synchronize browser history / URL hash changes
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (VALID_TABS.includes(hash)) {
        setActiveTab(hash)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigateToTab = (tabId) => {
    setActiveTab(tabId)
    window.location.hash = `#${tabId}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isAuthPage = ['login', 'signup', 'forgot-password'].includes(activeTab)

  // Render the active view
  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'about':
        return <AboutUs onNavigate={navigateToTab} />
      case 'features':
        return <Features onNavigate={navigateToTab} />
      case 'services':
        return <Services onNavigate={navigateToTab} />
      case 'contact':
        return <ContactUs onNavigate={navigateToTab} />
      case 'login':
        return <Login onNavigate={navigateToTab} />
      case 'signup':
        return <SignUp onNavigate={navigateToTab} />
      case 'forgot-password':
        return <ForgotPassword onNavigate={navigateToTab} />
      case 'home':
      default:
        return <Home onNavigate={navigateToTab} />
    }
  }

  // If on split-screen auth pages, hide public floating navbar and footer
  if (isAuthPage) {
    return (
      <div className="app-auth-container">
        {renderCurrentPage()}
      </div>
    )
  }

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={navigateToTab} />
      <main>
        {renderCurrentPage()}
      </main>
      <Footer onNavigate={navigateToTab} />
    </div>
  )
}

export default App
