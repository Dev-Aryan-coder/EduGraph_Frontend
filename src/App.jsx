import React, { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/public/Home'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  const scrollToSection = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(tabId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // Handle initial hash on page load (e.g. #about)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash)
      }, 150)
    }
  }, [])

  // Highlight active navbar tab dynamically as the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['contact', 'how-it-works', 'features', 'services', 'about', 'home']
      const scrollPos = window.scrollY + 220

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el && el.offsetTop <= scrollPos) {
          let navId = sectionId
          if (sectionId === 'how-it-works') navId = 'features'
          setActiveTab(navId)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={scrollToSection} />
      <main>
        <Home onNavigate={scrollToSection} />
      </main>
      <Footer onNavigate={scrollToSection} />
    </div>
  )
}

export default App
