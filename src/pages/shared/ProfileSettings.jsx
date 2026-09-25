import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import sharedService from '../../services/sharedService'
import {
  IconUser,
  IconKey,
  IconShield,
  IconCheck,
  IconAlertTriangle,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconGraduation,
  IconInstitution,
  IconMail,
  IconPhone
} from '../../components/common/Icons'
import './ProfileSettings.css'

export default function ProfileSettings({ onBack }) {
  const [user, setUser] = useState(() => authService.getStoredUser())
  const [isLoading, setIsLoading] = useState(true)

  // Profile Edit State
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')

  // Password Change State
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOldPass, setShowOldPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [isChangingPass, setIsChangingPass] = useState(false)
  const [passSuccess, setPassSuccess] = useState('')
  const [passError, setPassError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      const data = await sharedService.getCurrentUserProfile()
      if (data) {
        setUser(data)
        setFullName(data.fullName || data.name || '')
        setPhoneNumber(data.phoneNumber || '')
      }
    } catch {
      // Fallback to stored user
      if (user) {
        setFullName(user.fullName || user.name || '')
        setPhoneNumber(user.phoneNumber || '')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')

    if (!fullName.trim()) {
      setProfileError('Full name cannot be blank.')
      return
    }

    setIsUpdatingProfile(true)
    try {
      const updated = await sharedService.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim()
      })
      setUser(updated)
      // Update local storage
      const stored = authService.getStoredUser()
      if (stored) {
        localStorage.setItem(
          'edugraph_user',
          JSON.stringify({ ...stored, ...updated })
        )
      }
      setProfileSuccess('Profile information updated successfully!')
      setTimeout(() => setProfileSuccess(''), 4000)
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess('')

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPassError('New password and confirmation do not match.')
      return
    }

    setIsChangingPass(true)
    try {
      await sharedService.changePassword({
        oldPassword,
        newPassword
      })
      setPassSuccess('Password changed successfully! Keep your new credentials secure.')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPassSuccess(''), 4000)
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password. Verify your current password.')
    } finally {
      setIsChangingPass(false)
    }
  }

  const role = (user?.role || 'USER').toUpperCase()

  return (
    <div className="profile-settings-root">
      {/* Top Header */}
      <header className="profile-header">
        <div className="profile-header-left">
          {onBack && (
            <button className="profile-back-btn" onClick={onBack}>
              <IconArrowLeft size={16} /> Back to Dashboard
            </button>
          )}
          <div className="profile-title-wrap">
            <h2>Account & Security Settings</h2>
            <p>Manage your institutional profile, personal details, and authentication security</p>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="profile-content-container">
        {/* User Identity Card */}
        <div className="profile-identity-card">
          <div className="identity-avatar-wrap">
            <div className="identity-avatar">
              <IconUser size={38} color="#0D9488" />
            </div>
            <span className={`identity-role-badge role-${role.toLowerCase()}`}>
              {role.replace('ROLE_', '')}
            </span>
          </div>

          <div className="identity-details">
            <h3 className="identity-name">{user?.fullName || user?.name || 'User'}</h3>
            <p className="identity-email">
              <IconMail size={14} /> {user?.email}
            </p>

            <div className="identity-chips-grid">
              {user?.collegeName && (
                <div className="id-chip">
                  <IconInstitution size={14} color="#64748B" />
                  <span>{user.collegeName}</span>
                </div>
              )}
              {user?.department && (
                <div className="id-chip">
                  <IconGraduation size={14} color="#64748B" />
                  <span>Dept: {user.department}</span>
                </div>
              )}
              {user?.classroomName && (
                <div className="id-chip">
                  <IconGraduation size={14} color="#64748B" />
                  <span>Class: {user.classroomName}</span>
                </div>
              )}
              {user?.rollNumber && (
                <div className="id-chip">
                  <IconShield size={14} color="#64748B" />
                  <span>Roll #{user.rollNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dual Forms Layout */}
        <div className="profile-forms-grid">
          {/* Form 1: Personal Details */}
          <div className="profile-card">
            <div className="card-header">
              <IconUser size={18} color="#0D9488" />
              <h3>Personal Details</h3>
            </div>

            {profileSuccess && (
              <div className="profile-alert alert-success">
                <IconCheck size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="profile-alert alert-error">
                <IconAlertTriangle size={16} />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Full Legal Name *</label>
                <input
                  type="text"
                  className="profile-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Official Email Address</label>
                <input
                  type="email"
                  className="profile-input readonly"
                  value={user?.email || ''}
                  disabled
                />
                <span className="field-hint">Institutional email cannot be edited. Contact Admin for changes.</span>
              </div>

              <div className="form-group">
                <label>Contact Phone Number</label>
                <div className="input-with-icon">
                  <IconPhone size={16} className="input-icon" />
                  <input
                    type="tel"
                    className="profile-input with-icon"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-save-profile"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? 'Saving...' : (
                    <>
                      <IconCheck size={16} /> Save Personal Info
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Password & Security */}
          <div className="profile-card">
            <div className="card-header">
              <IconKey size={18} color="#0D9488" />
              <h3>Security & Password</h3>
            </div>

            {passSuccess && (
              <div className="profile-alert alert-success">
                <IconCheck size={16} />
                <span>{passSuccess}</span>
              </div>
            )}
            {passError && (
              <div className="profile-alert alert-error">
                <IconAlertTriangle size={16} />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label>Current Password *</label>
                <div className="password-input-wrap">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    className="profile-input"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    className="btn-toggle-eye"
                    onClick={() => setShowOldPass(!showOldPass)}
                  >
                    {showOldPass ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New Password (min 6 characters) *</label>
                <div className="password-input-wrap">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    className="profile-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="btn-toggle-eye"
                    onClick={() => setShowNewPass(!showNewPass)}
                  >
                    {showNewPass ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password *</label>
                <input
                  type="password"
                  className="profile-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-save-profile"
                  disabled={isChangingPass}
                >
                  {isChangingPass ? 'Updating...' : (
                    <>
                      <IconShield size={16} /> Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}