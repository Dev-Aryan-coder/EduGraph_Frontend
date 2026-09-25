import React, { useState } from 'react'
import logoSvg from '../../assets/edugraph-logo.svg'
import authService from '../../services/authService'
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconInstitution,
  IconUser,
  IconCheck,
  IconShield,
  IconGraduation
} from '../../components/common/Icons'
import './SignUp.css'

export default function SignUp({ onNavigate }) {
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeAddress: '',
    contactEmail: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!formData.collegeName || !formData.fullName || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all mandatory fields.')
      return
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.')
      return
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Academic Institutional Terms to proceed.')
      return
    }

    setIsLoading(true)

    try {
      const data = await authService.registerPrincipal(formData)
      setSuccessMessage(`College "${formData.collegeName}" & Principal account registered successfully! Entering workspace...`)

      setTimeout(() => {
        handleNavigate('principal')
      }, 1200)

    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check that the email is not already registered or ensure the backend server is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-split-wrapper">
      
      {/* =========================================================================
          LEFT SIDE: Registration Form
          ========================================================================= */}
      <div className="auth-left-col signup-left-col">
        <div className="auth-form-inner signup-form-inner">

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
            <div className="signup-badge-tag">
              <IconInstitution size={13} color="#1B7F72" />
              <span>COLLEGE & PRINCIPAL ONBOARDING</span>
            </div>
            <h1 className="auth-main-title">Register Your Institution</h1>
            <p className="auth-sub-title">
              Establish your college domain, appoint coordinators, and deploy visual whiteboard learning.
            </p>
          </div>

          {/* Alerts / Feedback */}
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

          {/* Sign Up Form */}
          <form className="auth-form signup-grid-form" onSubmit={handleSubmit} noValidate>
            
            {/* Section 1: Institution Details */}
            <div className="form-sub-heading">1. College / University Information</div>

            <div className="auth-input-group">
              <label htmlFor="collegeName" className="auth-label">
                College or University Name *
              </label>
              <div className="auth-input-wrapper">
                <span className="input-icon-left">
                  <IconInstitution size={18} color="#64748B" />
                </span>
                <input
                  id="collegeName"
                  name="collegeName"
                  type="text"
                  className="auth-text-input"
                  placeholder="e.g. State Institute of Technology"
                  value={formData.collegeName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-dual-row">
              <div className="auth-input-group">
                <label htmlFor="collegeAddress" className="auth-label">
                  Campus City / Address
                </label>
                <input
                  id="collegeAddress"
                  name="collegeAddress"
                  type="text"
                  className="auth-text-input text-input-padless"
                  placeholder="City, State"
                  value={formData.collegeAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-input-group">
                <label htmlFor="contactEmail" className="auth-label">
                  Campus Inquiry Email
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  className="auth-text-input text-input-padless"
                  placeholder="contact@college.edu"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 2: Principal Account Credentials */}
            <div className="form-sub-heading">2. Principal / Administrator Account</div>

            <div className="auth-dual-row">
              <div className="auth-input-group">
                <label htmlFor="fullName" className="auth-label">
                  Principal Full Name *
                </label>
                <div className="auth-input-wrapper">
                  <span className="input-icon-left">
                    <IconUser size={18} color="#64748B" />
                  </span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="auth-text-input"
                    placeholder="Dr. Eleanor Vance"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="email" className="auth-label">
                  Official Academic Email *
                </label>
                <div className="auth-input-wrapper">
                  <span className="input-icon-left">
                    <IconMail size={18} color="#64748B" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="auth-text-input"
                    placeholder="principal@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="auth-dual-row">
              <div className="auth-input-group">
                <label htmlFor="password" className="auth-label">
                  Account Password *
                </label>
                <div className="auth-input-wrapper">
                  <span className="input-icon-left">
                    <IconLock size={18} color="#64748B" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-text-input"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IconEyeOff size={17} color="#64748B" /> : <IconEye size={17} color="#64748B" />}
                  </button>
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="confirmPassword" className="auth-label">
                  Confirm Password *
                </label>
                <div className="auth-input-wrapper">
                  <span className="input-icon-left">
                    <IconLock size={18} color="#64748B" />
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="auth-text-input"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <IconEyeOff size={17} color="#64748B" /> : <IconEye size={17} color="#64748B" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="auth-options-row">
              <label className="remember-me-checkbox">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>I confirm I am an authorized institutional representative and agree to FERPA academic privacy standards.</span>
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
                  <span>Registering Institution...</span>
                </>
              ) : (
                <>
                  <span>Create Institutional Account</span>
                  <span className="btn-arrow">➔</span>
                </>
              )}
            </button>
          </form>

          {/* Switcher to Login */}
          <div className="auth-switch-footer">
            <span>Already have an institutional account?</span>
            <button
              type="button"
              className="switch-action-btn"
              onClick={() => handleNavigate('login')}
            >
              Sign In Here ➔
            </button>
          </div>

          {/* Faculty / Student Guidance Pill */}
          <div className="auth-trust-note">
            <span className="trust-dot" />
            <span>
              <strong>Faculty & Student Notice:</strong> Teachers and students do not need to register here. Your login credentials are automatically dispatched by your College Coordinator.
            </span>
          </div>

        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: Visual Artwork & Feature Showcase
          ========================================================================= */}
      <div className="auth-right-col">
        <div className="auth-visual-inner">

          {/* Decorative Glows */}
          <div className="visual-glow-teal" />
          <div className="visual-glow-amber" />

          <div className="visual-hero-cards">

            <div className="visual-badge-pill">
              <IconInstitution size={14} color="#1B7F72" />
              <span>COLLEGE-WIDE DEPLOYMENT</span>
            </div>

            <h2 className="visual-hero-heading">
              Empower Faculty. <br />
              Inspire Visual Mastery.
            </h2>
            
            <p className="visual-hero-sub">
              From automated coordinator delegation to instant syllabus Excel imports, deploy EduGraph campus-wide in less than 4 weeks.
            </p>

            {/* Institutional Hierarchy Diagram Card */}
            <div className="visual-node-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="m-dot dot-red" />
                  <span className="m-dot dot-amber" />
                  <span className="m-dot dot-green" />
                </div>
                <span className="mockup-title">Institutional Cascading Trust Model</span>
                <span className="mockup-status">● Auditable</span>
              </div>

              <div className="mockup-hierarchy-stream">
                <div className="hier-step">
                  <div className="hier-badge badge-navy">
                    <IconInstitution size={14} /> Principal
                  </div>
                  <span className="hier-arrow">➔ Creates</span>
                  <div className="hier-badge badge-teal">
                    <IconUser size={14} /> Coordinator
                  </div>
                </div>

                <div className="hier-step">
                  <div className="hier-badge badge-teal">
                    Coordinator
                  </div>
                  <span className="hier-arrow">➔ Bulk Excel Import</span>
                  <div className="hier-badge badge-amber">
                    <IconGraduation size={14} /> Faculty & Students
                  </div>
                </div>
              </div>

              <div className="mockup-footer">
                <div className="footer-chip chip-teal">
                  <IconShield size={13} color="#1B7F72" />
                  <span>SAML 2.0 / LTI 1.3 Certified</span>
                </div>
                <div className="footer-chip chip-green">
                  <IconCheck size={13} color="#16A34A" />
                  <span>FERPA Compliant</span>
                </div>
              </div>
            </div>

            {/* Institutional Metrics */}
            <div className="visual-stats-bar">
              <div className="v-stat-item">
                <span className="v-stat-num">99.99%</span>
                <span className="v-stat-label">Platform SLA</span>
              </div>
              <div className="v-stat-sep" />
              <div className="v-stat-item">
                <span className="v-stat-num">&lt; 0.2s</span>
                <span className="v-stat-label">MCQ Verification</span>
              </div>
              <div className="v-stat-sep" />
              <div className="v-stat-item">
                <span className="v-stat-num">0%</span>
                <span className="v-stat-label">Plagiarism Tolerance</span>
              </div>
            </div>

          </div>

          <div className="visual-bottom-meta">
            <span>© 2026 EduGraph Technologies Inc.</span>
            <span>Accredited Academic Infrastructure</span>
          </div>

        </div>
      </div>

    </div>
  )
}
