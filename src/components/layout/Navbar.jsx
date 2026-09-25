import React, { useState, useEffect } from 'react'
import logoSvg from '../../assets/edugraph-logo.svg'
import authService from '../../services/authService'
import AccountMenu from '../auth/AccountMenu'
import './Navbar.css'

export default function Navbar({ activeTab = 'home', setActiveTab }) {
  const [user, setUser] = useState(() => authService.getStoredUser())

  useEffect(() => {
    const checkUser = () => {
      setUser(authService.getStoredUser())
    }

    window.addEventListener('edugraph_auth_change', checkUser)
    window.addEventListener('storage', checkUser)

    return () => {
      window.removeEventListener('edugraph_auth_change', checkUser)
      window.removeEventListener('storage', checkUser)
    }
  }, [])

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About Us', href: '#about' },
    { id: 'features', label: 'Features', href: '#features' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'contact', label: 'Contact Us', href: '#contact' },
  ]

  const handleNavClick = (id) => {
    if (setActiveTab) {
      setActiveTab(id)
    } else {
      window.location.hash = `#${id}`
    }
  }

  return (
    <header className="navbar-header-wrapper">
      {/* 1. Brand Logo at the FAR LEFT of the browser screen */}
      <a 
        href="#home" 
        className="screen-left-logo-link"
        onClick={(e) => {
          e.preventDefault()
          handleNavClick('home')
        }}
        aria-label="EduGraph Home"
      >
        <img 
          src={logoSvg} 
          alt="EduGraph" 
          className="screen-left-logo-img" 
        />
      </a>

      {/* 2. Floating Navbar centered in the middle of the screen (5 pages) */}
      <nav className="excalidraw-navbar" aria-label="Main Navigation">
        <div className="navbar-container">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.id)
                }}
              >
                <span className="nav-label">{item.label}</span>
                {isActive && <span className="active-sketch-line" aria-hidden="true" />}
              </a>
            )
          })}
        </div>
      </nav>

      {/* 3. Account Symbol or Login/SignUp Buttons at the FAR RIGHT */}
      <div className="screen-right-auth-actions">
        {user ? (
          <AccountMenu onNavigate={setActiveTab} />
        ) : (
          <>
            <a 
              href="#login" 
              className="auth-btn login-btn"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('login')
              }}
            >
              Login
            </a>
            <a 
              href="#signup" 
              className="auth-btn signup-btn"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('signup')
              }}
            >
              Sign Up
            </a>
          </>
        )}
      </div>
    </header>
  )
}