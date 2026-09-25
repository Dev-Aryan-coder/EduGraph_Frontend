import React, { useState } from 'react'
import logoSvg from '../../assets/edugraph-logo.svg'
import './Navbar.css'

export default function Navbar({ activeTab = 'home', setActiveTab }) {
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

      {/* 3. Login and Sign Up Buttons at the FAR RIGHT of the browser screen */}
      <div className="screen-right-auth-actions">
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
      </div>
    </header>
  )
}