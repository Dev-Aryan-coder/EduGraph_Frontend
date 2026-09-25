import React from 'react'
import logoSvg from '../../assets/edugraph-logo.svg'
import './Footer.css'

export default function Footer({ onNavigate }) {
  const handleNav = (e, tab) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(tab)
    } else {
      window.location.hash = `#${tab}`
    }
  }

  return (
    <footer className="edugraph-footer" id="footer">
      <div className="footer-inner-container">
        
        {/* Top Section: Brand Info + 4 Concise Link Columns */}
        <div className="footer-top-grid">
          
          {/* Brand Column with Transparent Vector Logo */}
          <div className="footer-brand-col">
            <a 
              href="#home" 
              className="footer-logo-link" 
              aria-label="EduGraph Home"
              onClick={(e) => handleNav(e, 'home')}
            >
              <img src={logoSvg} alt="EduGraph Logo" className="footer-brand-logo" />
            </a>
            <p className="footer-brand-tagline">
              Visual Knowledge Whiteboard & Verification System empowering universities, educators, and students with genuine conceptual mastery.
            </p>
            <div className="footer-status-pill">
              <span className="footer-status-dot" />
              <span>All Systems Operational • v2.4</span>
            </div>
          </div>

          {/* Navigation Links (Matches Navbar Pages) */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><a href="#home" onClick={(e) => handleNav(e, 'home')}>Home</a></li>
              <li><a href="#about" onClick={(e) => handleNav(e, 'about')}>About Us</a></li>
              <li><a href="#features" onClick={(e) => handleNav(e, 'features')}>Features</a></li>
              <li><a href="#services" onClick={(e) => handleNav(e, 'services')}>Services</a></li>
              <li><a href="#contact" onClick={(e) => handleNav(e, 'contact')}>Contact Us</a></li>
            </ul>
          </div>

          {/* Platform Solutions */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links-list">
              <li><a href="#features">Edudraw Studio Canvas</a></li>
              <li><a href="#features">Anti-Cheat Proctoring</a></li>
              <li><a href="#features">Concept Topology</a></li>
              <li><a href="#services">20-MCQ Quiz Engine</a></li>
              <li><a href="#services">Verified Grade Reports</a></li>
            </ul>
          </div>

          {/* Institutional Resources */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Institutions</h4>
            <ul className="footer-links-list">
              <li><a href="#services">College Principal Portal</a></li>
              <li><a href="#services">Faculty Credential Flow</a></li>
              <li><a href="#services">LMS & API Connectors</a></li>
              <li><a href="#contact">Support & Inquiries</a></li>
              <li><a href="#contact">Schedule Campus Demo</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} EduGraph Technologies Inc. All rights reserved.
          </div>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="footer-legal-sep">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="footer-legal-sep">•</span>
            <a href="#security">Academic Security</a>
          </div>
        </div>

      </div>
    </footer>
  )
}