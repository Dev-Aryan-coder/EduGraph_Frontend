import React, { useState } from 'react'
import logoSvg from '../../assets/edugraph-logo.svg'
import authService from '../../services/authService'
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconBrain,
  IconShield,
  IconTarget,
  IconBolt,
  IconCheck
} from '../../components/common/Icons'
import './Login.css'

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleNavigate = (tab) => {
    if (onNavigate) {
      onNavigate(tab)
    } else {
      window.location.hash = `#${tab}`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!email || !password) {
      setErrorMessage('Please enter both academic email and password.')
      return
    }

    setIsLoading(true)

    try {
      const data = await authService.login(email, password)
      setSuccessMessage(`Welcome back, ${data.fullName || 'User'}! Redirecting to workspace...`)
      
      // Store session state
      if (rememberMe) {
        localStorage.setItem('edugraph_remember_email', email)
      } else {
        localStorage.removeItem('edugraph_remember_email')
      }

      // Short delay for user feedback then redirect
      setTimeout(() => {
        const userRole = data.role ? data.role.toUpperCase() : ''
        if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
          handleNavigate('admin')
        } else if (userRole === 'PRINCIPAL' || userRole === 'ROLE_PRINCIPAL') {
          handleNavigate('dashboard')
        } else if (userRole === 'COORDINATOR' || userRole === 'ROLE_COORDINATOR') {
          handleNavigate('coordinator')
        } else if (userRole === 'TEACHER' || userRole === 'ROLE_TEACHER') {
          handleNavigate('teacher')
        } else if (userRole === 'STUDENT' || userRole === 'ROLE_STUDENT') {
          handleNavigate('student')
        } else {
          handleNavigate('home')
        }
      }, 1000)

    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials or ensure the backend server is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-split-wrapper">
      
      {/* =========================================================================
          LEFT SIDE: Authentication Form
          ========================================================================= */}
      <div className="auth-left-col">
        <div className="auth-form-inner">

          {/* Top Brand Navigation Link */}
          <div className="auth-top-nav">
            <button 
              type="button" 
              className="back-home-btn"
              onClick={() => handleNavigate('home')}
            >
              <IconArrowLeft size={16} />
              <span>Back to Home</span>
            </button>

            <img 
              src={logoSvg} 
              alt="EduGraph Logo" 
              className="auth-brand-logo" 
              onClick={() => handleNavigate('home')}
            />
          </div>

          {/* Headline & Subtitle */}
          <div className="auth-header-block">
            <h1 className="auth-main-title">Sign In to EduGraph</h1>
            <p className="auth-sub-title">
              Enter your institutional credentials to access your visual knowledge workspace.
            </p>
          </div>

          {/* Alerts / Error Feedback */}
          {errorMessage && (
            <div className="auth-alert alert-error">
              <span className="alert-dot" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert alert-success">
              <IconCheck size={16} color="#16A34A" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            
            {/* Email Field */}
            <div className="auth-input-group">
              <label htmlFor="login-email" className="auth-label">
                Academic Email Address
              </label>
              <div className="auth-input-wrapper">
                <span className="input-icon-left">
                  <IconMail size={18} color="#64748B" />
                </span>
                <input
                  id="login-email"
                  type="email"
                  className="auth-text-input"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-input-group">
              <div className="label-with-action">
                <label htmlFor="login-password" className="auth-label">
                  Password
                </label>
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() => handleNavigate('forgot-password')}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="auth-input-wrapper">
                <span className="input-icon-left">
                  <IconLock size={18} color="#64748B" />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-text-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <IconEyeOff size={18} color="#64748B" />
                  ) : (
                    <IconEye size={18} color="#64748B" />
                  )}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="auth-options-row">
              <label className="remember-me-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <span className="btn-arrow">➔</span>
                </>
              )}
            </button>
          </form>

          {/* Switcher to Sign Up */}
          <div className="auth-switch-footer">
            <span>New institutional leader?</span>
            <button
              type="button"
              className="switch-action-btn"
              onClick={() => handleNavigate('signup')}
            >
              Register College & Principal ➔
            </button>
          </div>

          {/* Informational Role Note */}
          <div className="auth-trust-note">
            <span className="trust-dot" />
            <span>
              Students & faculty log in using credentials issued by their College Coordinator.
            </span>
          </div>

        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: Visual Artwork & Feature Showcase
          ========================================================================= */}
      <div className="auth-right-col">
        <div className="auth-visual-inner">

          {/* Decorative Glow Overlays */}
          <div className="visual-glow-teal" />
          <div className="visual-glow-amber" />

          {/* Visual Showcase Card Container */}
          <div className="visual-hero-cards">

            {/* Top Brand Pill */}
            <div className="visual-badge-pill">
              <IconBolt size={14} color="#C6822E" />
              <span>TAMPER-PROOF ACADEMIC PLATFORM</span>
            </div>

            <h2 className="visual-hero-heading">
              Visual Thinking. <br />
              Verified Understanding.
            </h2>
            
            <p className="visual-hero-sub">
              Replacing copy-pasted assignments with interactive whiteboard knowledge graphs and automated 20-MCQ ownership verification.
            </p>

            {/* Floating Visual Node Diagram Mockup */}
            <div className="visual-node-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="m-dot dot-red" />
                  <span className="m-dot dot-amber" />
                  <span className="m-dot dot-green" />
                </div>
                <span className="mockup-title">Physics 301 • Live Knowledge Graph</span>
                <span className="mockup-status">● Real-time Proctored</span>
              </div>

              <div className="mockup-body">
                <div className="m-node node-primary">
                  <IconBrain size={16} color="#FFFFFF" />
                  <span>Maxwell's Electrodynamics</span>
                </div>
                <div className="m-connector">
                  <span>Derives ➔</span>
                </div>
                <div className="m-node node-secondary">
                  <IconTarget size={16} color="#1B7F72" />
                  <span>Wave Speed in Vacuum (c)</span>
                </div>
              </div>

              <div className="mockup-footer">
                <div className="footer-chip chip-green">
                  <IconShield size={13} color="#16A34A" />
                  <span>0 Tab Switches</span>
                </div>
                <div className="footer-chip chip-teal">
                  <IconCheck size={13} color="#1B7F72" />
                  <span>20/20 MCQ Verified</span>
                </div>
              </div>
            </div>

            {/* Institutional Stat Metric Banner */}
            <div className="visual-stats-bar">
              <div className="v-stat-item">
                <span className="v-stat-num">250+</span>
                <span className="v-stat-label">Universities</span>
              </div>
              <div className="v-stat-sep" />
              <div className="v-stat-item">
                <span className="v-stat-num">99.4%</span>
                <span className="v-stat-label">Verified Integrity</span>
              </div>
              <div className="v-stat-sep" />
              <div className="v-stat-item">
                <span className="v-stat-num">+3.8x</span>
                <span className="v-stat-label">Concept Retention</span>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Watermark */}
          <div className="visual-bottom-meta">
            <span>© 2026 EduGraph Technologies Inc.</span>
            <span>All systems operational • v2.4</span>
          </div>

        </div>
      </div>

    </div>
  )
}