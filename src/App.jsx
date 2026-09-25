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
import PrincipalDashboard from './pages/principal/PrincipalDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard'
import authService from './services/authService'
import './App.css'

const VALID_TABS = [
  'home',
  'about',
  'features',
  'services',
  'contact',
  'login',
  'signup',
  'forgot-password',
  'dashboard',
  'admin',
  'coordinator'
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
  const isDashboardPage = activeTab === 'dashboard'
  const isAdminPage = activeTab === 'admin'
  const isCoordinatorPage = activeTab === 'coordinator'

  // If on split-screen auth pages, hide public floating navbar and footer
  if (isAuthPage) {
    return (
      <div className="app-auth-container">
        {activeTab === 'login' && <Login onNavigate={navigateToTab} />}
        {activeTab === 'signup' && <SignUp onNavigate={navigateToTab} />}
        {activeTab === 'forgot-password' && <ForgotPassword onNavigate={navigateToTab} />}
      </div>
    )
  }

  // Reactive user session state
  const [currentUser, setCurrentUser] = useState(() => authService.getStoredUser())

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authService.getStoredUser())
    }
    window.addEventListener('edugraph_auth_change', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)
    return () => {
      window.removeEventListener('edugraph_auth_change', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  const role = (currentUser?.role || '').toUpperCase()
  const isUserAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN'
  const isUserCoordinator = role === 'COORDINATOR' || role === 'ROLE_COORDINATOR'
  const isUserPrincipal = role === 'PRINCIPAL' || role === 'ROLE_PRINCIPAL'

  // Render Super Admin Workspace
  if (isAdminPage || (isDashboardPage && isUserAdmin)) {
    return <AdminDashboard onNavigate={navigateToTab} />
  }

  // Render Coordinator Workspace
  if (isCoordinatorPage || (isDashboardPage && isUserCoordinator)) {
    return <CoordinatorDashboard onNavigate={navigateToTab} />
  }

  // Render Principal Workspace
  if (isDashboardPage && isUserPrincipal) {
    return <PrincipalDashboard onNavigate={navigateToTab} />
  }

  // If on Dashboard without specific role or unauthenticated
  if (isDashboardPage) {
    if (!currentUser) {
      return (
        <div className="app-auth-container">
          <Login onNavigate={navigateToTab} />
        </div>
      )
    }
    return <PrincipalDashboard onNavigate={navigateToTab} />
  }

  // Render the active public view
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
      case 'home':
      default:
        return <Home onNavigate={navigateToTab} />
    }
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
