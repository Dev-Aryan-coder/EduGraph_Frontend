import React, { useState } from 'react'
import authService from '../../services/authService'
import {
  IconLock,
  IconKey,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconX,
  IconShield,
  IconInfo
} from '../common/Icons'
import './AccountSettingsModal.css'

export default function AccountSettingsModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!oldPassword) {
      setErrorMsg('Please enter your current password.')
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.')
      return
    }

    if (oldPassword === newPassword) {
      setErrorMsg('New password cannot be identical to your current password.')
      return
    }

    try {
      setIsLoading(true)
      await authService.changePassword(oldPassword, newPassword)
      setSuccessMsg('Your account password has been updated securely!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        setSuccessMsg('')
        onClose()
      }, 1500)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password. Please check your current password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="shadcn-dialog-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="shadcn-dialog-content account-dialog" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="shadcn-dialog-header">
          <div className="dialog-title-row">
            <div className="dialog-badge badge-amber">
              <IconKey size={14} color="#C6822E" />
              <span>ACCOUNT & SECURITY</span>
            </div>
            <button 
              type="button" 
              className="dialog-close-btn" 
              onClick={onClose}
              aria-label="Close dialog"
            >
              <IconX size={18} />
            </button>
          </div>
          <h2 className="shadcn-dialog-title">Security & Password</h2>
          <p className="shadcn-dialog-description">
            Update your account password and review credential security policies.
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="shadcn-alert alert-error">
            <span className="alert-bullet" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="shadcn-alert alert-success">
            <IconCheck size={16} color="#16A34A" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="shadcn-form">
          {/* Current Password */}
          <div className="shadcn-input-group">
            <label htmlFor="old-pass" className="shadcn-label">
              Current Password *
            </label>
            <div className="input-with-icon">
              <span className="input-prefix-icon">
                <IconLock size={16} color="#64748B" />
              </span>
              <input
                id="old-pass"
                type={showOldPassword ? 'text' : 'password'}
                className="shadcn-input with-prefix with-suffix"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="input-suffix-btn"
                onClick={() => setShowOldPassword(!showOldPassword)}
                tabIndex="-1"
              >
                {showOldPassword ? <IconEyeOff size={16} color="#64748B" /> : <IconEye size={16} color="#64748B" />}
              </button>
            </div>
          </div>

          <div className="shadcn-divider" />

          {/* New Password */}
          <div className="shadcn-input-group">
            <label htmlFor="new-pass" className="shadcn-label">
              New Password (Min 6 characters) *
            </label>
            <div className="input-with-icon">
              <span className="input-prefix-icon">
                <IconKey size={16} color="#64748B" />
              </span>
              <input
                id="new-pass"
                type={showNewPassword ? 'text' : 'password'}
                className="shadcn-input with-prefix with-suffix"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter strong new password"
                required
              />
              <button
                type="button"
                className="input-suffix-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex="-1"
              >
                {showNewPassword ? <IconEyeOff size={16} color="#64748B" /> : <IconEye size={16} color="#64748B" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="shadcn-input-group">
            <label htmlFor="confirm-pass" className="shadcn-label">
              Confirm New Password *
            </label>
            <div className="input-with-icon">
              <span className="input-prefix-icon">
                <IconKey size={16} color="#64748B" />
              </span>
              <input
                id="confirm-pass"
                type={showConfirmPassword ? 'text' : 'password'}
                className="shadcn-input with-prefix with-suffix"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
              <button
                type="button"
                className="input-suffix-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <IconEyeOff size={16} color="#64748B" /> : <IconEye size={16} color="#64748B" />}
              </button>
            </div>
          </div>

          {/* Security Policy Banner */}
          <div className="security-policy-box">
            <div className="policy-row">
              <IconShield size={14} color="#16A34A" />
              <span>Passwords are encrypted using <strong>BCrypt salt rounds</strong> with zero plaintext storage.</span>
            </div>
            <div className="policy-row">
              <IconInfo size={14} color="#64748B" />
              <span>After updating, active sessions on other devices will require re-authentication.</span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="shadcn-dialog-footer">
            <button
              type="button"
              className="shadcn-btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="shadcn-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="shadcn-spinner" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Update Password</span>
                  <IconCheck size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
