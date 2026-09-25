import React, { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/public/Home'
import AboutUs from './pages/public/AboutUs'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return ['home', 'about', 'features', 'services', 'contact'].includes(hash) ? hash : 'home'
  })

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (['home', 'about', 'features', 'services', 'contact'].includes(hash)) {
        setActiveTab(hash)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    window.location.hash = `#${tabId}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />
      <main>
        {activeTab === 'about' ? (
          <AboutUs onNavigate={handleTabChange} />
        ) : (
          <Home onNavigate={handleTabChange} />
        )}
      </main>
      <Footer onNavigate={handleTabChange} />
    </div>
  )
}

export default App
