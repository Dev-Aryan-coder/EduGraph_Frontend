import React, { useState, useEffect } from 'react'
import logoSvg from '../../assets/edugraph-logo.svg'
import authService from '../../services/authService'
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconKey,
  IconCheck,
  IconShield,
  IconBolt
} from '../../components/common/Icons'
import './ForgotPassword.css'

export default function ForgotPassword({ onNavigate }) {
  // Steps: 1 = Email, 2 = OTP, 3 = Reset Password, 4 = Success Confirmation
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleNavigate = (tab) => {
    if (onNavigate) {
      onNavigate(tab)
    } else {
      window.location.hash = `#${tab}`
    }
  }

  // Resend timer countdown
  useEffect(() => {
    let interval = null
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendCooldown])

  // =========================================================================
  // STEP 1: Send OTP to Email
  // =========================================================================
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid registered academic email.')
      return
    }

    setIsLoading(true)
    try {
      const msg = await authService.sendForgotPasswordOtp(email)
      setSuccessMessage(msg || '6-digit verification code sent to your email.')
      setCurrentStep(2)
      setResendCooldown(60) // 60s cooldown
    } catch (err) {
      setErrorMessage(err.message || 'Unable to find an account with this email. Please check spelling or contact your administrator.')
    } finally {
      setIsLoading(false)
    }
  }

  // =========================================================================
  // STEP 2: Verify OTP
  // =========================================================================
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const cleanOtp = otp.trim()
    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.')
      return
    }

    setIsLoading(true)
    try {
      const msg = await authService.verifyForgotPasswordOtp(email, cleanOtp)
      setSuccessMessage(msg || 'Verification code confirmed. Set your new password below.')
      setCurrentStep(3)
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired verification code. Please check your inbox or request a new code.')
    } finally {
      setIsLoading(false)
    }
  }

  // =========================================================================
  // STEP 3: Reset Password in Database
  // =========================================================================
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.')
      return
    }

    setIsLoading(true)
    try {
      await authService.resetPassword(email, otp.trim(), newPassword)
      setSuccessMessage('Password reset successfully! Redirecting you to login...')
      setCurrentStep(4)

      setTimeout(() => {
        handleNavigate('login')
      }, 2000)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to reset password. The OTP may have expired.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-split-wrapper">

      {/* =========================================================================
          LEFT SIDE: Multi-Step Forgot Password Wizard
          ========================================================================= */}
      <div className="auth-left-col">
        <div className="auth-form-inner forgot-form-inner">

          {/* Top Brand Navigation */}
          <div className="auth-top-nav">
            <button 
              type="button" 
              className="back-home-btn"
              onClick={() => handleNavigate('login')}
            >
              <IconArrowLeft size={16} />
              <span>Back to Login</span>
            </button>

            <img 
              src={logoSvg} 
              alt="EduGraph Logo" 
              className="auth-brand-logo" 
              onClick={() => handleNavigate('home')}
            />
          </div>

          {/* Progressive Step Breadcrumb Indicator */}
          <div className="forgot-progress-track">
            <div className={`step-dot ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              {currentStep > 1 ? <IconCheck size={12} color="#FFFFFF" /> : '1'}
            </div>
            <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`} />
            <div className={`step-dot ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              {currentStep > 2 ? <IconCheck size={12} color="#FFFFFF" /> : '2'}
            </div>
            <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`} />
            <div className={`step-dot ${currentStep >= 3 ? 'active' : ''} ${currentStep >= 4 ? 'completed' : ''}`}>
              {currentStep >= 4 ? <IconCheck size={12} color="#FFFFFF" /> : '3'}
            </div>
          </div>

          {/* Alert Messages */}
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

          {/* =================================================================
              STEP 1: Enter Academic Email
              ================================================================= */}
          {currentStep === 1 && (
            <div className="forgot-step-block">
              <div className="auth-header-block">
                <div className="step-eyebrow">STEP 1 OF 3 • ACCOUNT IDENTIFICATION</div>
                <h1 className="auth-main-title">Reset Your Password</h1>
                <p className="auth-sub-title">
                  Enter your registered academic email. We will check the database and dispatch a 6-digit verification code.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSendOtp} noValidate>
                <div className="auth-input-group">
                  <label htmlFor="forgot-email" className="auth-label">
                    Registered Academic Email *
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="input-icon-left">
                      <IconMail size={18} color="#64748B" />
                    </span>
                    <input
                      id="forgot-email"
                      type="email"
                      className="auth-text-input"
                      placeholder="e.g. professor@xavier.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="btn-spinner" />
                      <span>Checking Database & Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit OTP</span>
                      <span className="btn-arrow">➔</span>
                    </>
                  )}
                </button>
              </form>

              <div className="auth-switch-footer">
                <span>Remember your password?</span>
                <button
                  type="button"
                  className="switch-action-btn"
                  onClick={() => handleNavigate('login')}
                >
                  Sign In Instead ➔
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              STEP 2: Enter 6-Digit OTP Code
              ================================================================= */}
          {currentStep === 2 && (
            <div className="forgot-step-block">
              <div className="auth-header-block">
                <div className="step-eyebrow">STEP 2 OF 3 • VERIFY IDENTITY</div>
                <h1 className="auth-main-title">Enter Verification Code</h1>
                <p className="auth-sub-title">
                  We dispatched a 6-digit verification code to <strong>{email}</strong>. Valid for 10 minutes.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleVerifyOtp} noValidate>
                <div className="auth-input-group">
                  <label htmlFor="otp-input" className="auth-label">
                    6-Digit Verification Code (OTP) *
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="input-icon-left">
                      <IconKey size={18} color="#64748B" />
                    </span>
                    <input
                      id="otp-input"
                      type="text"
                      maxLength={6}
                      className="auth-text-input otp-large-input"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="otp-resend-row">
                  {resendCooldown > 0 ? (
                    <span className="resend-countdown">
                      Resend code available in <strong>{resendCooldown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="resend-action-btn"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                    >
                      Didn't receive code? Resend Email
                    </button>
                  )}
                  <button
                    type="button"
                    className="change-email-btn"
                    onClick={() => {
                      setCurrentStep(1)
                      setErrorMessage('')
                      setSuccessMessage('')
                    }}
                  >
                    Change Email
                  </button>
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="btn-spinner" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code & Proceed</span>
                      <span className="btn-arrow">➔</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* =================================================================
              STEP 3: Reset Password
              ================================================================= */}
          {currentStep === 3 && (
            <div className="forgot-step-block">
              <div className="auth-header-block">
                <div className="step-eyebrow">STEP 3 OF 3 • NEW CREDENTIALS</div>
                <h1 className="auth-main-title">Set New Password</h1>
                <p className="auth-sub-title">
                  Your identity has been verified. Enter a secure new password for <strong>{email}</strong>.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleResetPassword} noValidate>
                <div className="auth-input-group">
                  <label htmlFor="new-password" className="auth-label">
                    New Password (Min 6 Characters) *
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="input-icon-left">
                      <IconLock size={18} color="#64748B" />
                    </span>
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      className="auth-text-input"
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoFocus
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
                  <label htmlFor="confirm-new-password" className="auth-label">
                    Confirm New Password *
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="input-icon-left">
                      <IconLock size={18} color="#64748B" />
                    </span>
                    <input
                      id="confirm-new-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="auth-text-input"
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="btn-spinner" />
                      <span>Updating Password in Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Password & Return to Login</span>
                      <span className="btn-arrow">➔</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* =================================================================
              STEP 4: Success & Auto-Redirect
              ================================================================= */}
          {currentStep === 4 && (
            <div className="forgot-success-card">
              <div className="success-icon-badge">
                <IconCheck size={32} color="#16A34A" />
              </div>
              <h2 className="success-title">Password Reset Complete!</h2>
              <p className="success-desc">
                Your password has been securely updated in the database. Redirecting you to the sign-in screen...
              </p>
              <button
                type="button"
                className="auth-submit-btn"
                onClick={() => handleNavigate('login')}
              >
                Go to Sign In Now ➔
              </button>
            </div>
          )}

        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: Security Architecture Showcase
          ========================================================================= */}
      <div className="auth-right-col">
        <div className="auth-visual-inner">

          <div className="visual-glow-teal" />
          <div className="visual-glow-amber" />

          <div className="visual-hero-cards">

            <div className="visual-badge-pill">
              <IconShield size={14} color="#1B7F72" />
              <span>CRYPTOGRAPHIC IDENTITY PROTECTION</span>
            </div>

            <h2 className="visual-hero-heading">
              Secure by Design. <br />
              Zero-Trust Verification.
            </h2>
            
            <p className="visual-hero-sub">
              Every password reset is protected by one-time salted verification codes and instant real-time audit logs across institutional domains.
            </p>

            {/* Security Architecture Visual Card */}
            <div className="visual-node-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="m-dot dot-red" />
                  <span className="m-dot dot-amber" />
                  <span className="m-dot dot-green" />
                </div>
                <span className="mockup-title">Security Gateway • SHA-256 Hashed</span>
                <span className="mockup-status">● Encrypted</span>
              </div>

              <div className="security-flow-row">
                <div className="sec-step-pill">
                  <IconMail size={14} /> 1. Registered Email Check
                </div>
                <span className="sec-arrow">➔</span>
                <div className="sec-step-pill">
                  <IconKey size={14} /> 2. 6-Digit OTP Validated
                </div>
                <span className="sec-arrow">➔</span>
                <div className="sec-step-pill">
                  <IconLock size={14} /> 3. Bcrypt Encrypted
                </div>
              </div>

              <div className="mockup-footer">
                <div className="footer-chip chip-green">
                  <IconShield size={13} color="#16A34A" />
                  <span>Real-time SMTP Dispatch</span>
                </div>
                <div className="footer-chip chip-teal">
                  <IconBolt size={13} color="#1B7F72" />
                  <span>10-Minute Expiry Window</span>
                </div>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="visual-stats-bar">
              <div className="v-stat-item">
                <span className="v-stat-num">256-Bit</span>
                <span className="v-stat-label">AES Encryption</span>
              </div>
              <div className="v-stat-sep" />
              <div className="v-stat-item">
                <span className="v-stat-num">10 Min</span>
                <span className="v-stat-label">OTP Lifetime</span>
              </div>
              <div className="v-stat-sep" />
              <div className="v-stat-item">
                <span className="v-stat-num">100%</span>
                <span className="v-stat-label">Audit Logging</span>
              </div>
            </div>

          </div>

          <div className="visual-bottom-meta">
            <span>© 2026 EduGraph Technologies Inc.</span>
            <span>Zero-Trust Academic Security</span>
          </div>

        </div>
      </div>

    </div>
  )
}
