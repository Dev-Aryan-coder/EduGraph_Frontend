import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import {
  IconUser,
  IconMail,
  IconLock,
  IconCamera,
  IconX,
  IconCheck,
  IconPhone,
  IconBadgeId,
  IconInstitution,
  IconInfo
} from '../common/Icons'
import './ProfileSettingsModal.css'

export default function ProfileSettingsModal({ isOpen, onClose, onProfileUpdated }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [imagePreviewError, setImagePreviewError] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (isOpen) {
      const user = authService.getStoredUser()
      if (user) {
        setCurrentUser(user)
        setFullName(user.fullName || '')
        setPhoneNumber(user.phoneNumber || '')
        setProfileImageUrl(user.profileImageUrl || '')
        setImagePreviewError(false)
        setSuccessMsg('')
        setErrorMsg('')
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleImageUrlChange = (e) => {
    setProfileImageUrl(e.target.value)
    setImagePreviewError(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!fullName.trim()) {
      setErrorMsg('Full name cannot be empty.')
      return
    }

    try {
      setIsLoading(true)
      const updatedUser = await authService.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        profileImageUrl: profileImageUrl.trim(),
      })

      setSuccessMsg('Profile updated successfully!')
      if (onProfileUpdated) {
        onProfileUpdated(updatedUser)
      }
      setTimeout(() => {
        setSuccessMsg('')
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="shadcn-dialog-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="shadcn-dialog-content profile-dialog" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="shadcn-dialog-header">
          <div className="dialog-title-row">
            <div className="dialog-badge">
              <IconUser size={14} color="#1B7F72" />
              <span>PROFILE SETTINGS</span>
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
          <h2 className="shadcn-dialog-title">Institutional Profile</h2>
          <p className="shadcn-dialog-description">
            Update your display photo and personal details. Institutional records are locked.
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

        <form onSubmit={handleSave} className="shadcn-form">
          {/* Avatar Preview & Online Image URL Section */}
          <div className="profile-avatar-row">
            <div className="avatar-preview-box">
              {profileImageUrl && !imagePreviewError ? (
                <img
                  src={profileImageUrl}
                  alt="Avatar Preview"
                  className="preview-img"
                  onError={() => setImagePreviewError(true)}
                />
              ) : (
                <div className="preview-fallback">
                  {getInitials(fullName || currentUser?.fullName)}
                </div>
              )}
              <div className="avatar-camera-pill">
                <IconCamera size={13} color="#FFFFFF" />
              </div>
            </div>

            <div className="avatar-url-group">
              <label htmlFor="profile-img-url" className="shadcn-label">
                Profile Image Online URL
              </label>
              <input
                id="profile-img-url"
                type="url"
                className="shadcn-input"
                placeholder="https://images.example.com/avatar.jpg"
                value={profileImageUrl}
                onChange={handleImageUrlChange}
              />
              <span className="shadcn-help-text">
                Paste any valid public image link (Unsplash, Imgur, Cloudinary, etc.)
              </span>
              {imagePreviewError && profileImageUrl && (
                <span className="shadcn-warn-text">
                  Could not load preview. Please verify the URL points directly to an image.
                </span>
              )}
            </div>
          </div>

          <div className="shadcn-divider" />

          {/* Full Name & Phone (Editable) */}
          <div className="form-grid-2col">
            <div className="shadcn-input-group">
              <label htmlFor="edit-full-name" className="shadcn-label">
                Full Legal Name *
              </label>
              <div className="input-with-icon">
                <span className="input-prefix-icon">
                  <IconUser size={16} color="#64748B" />
                </span>
                <input
                  id="edit-full-name"
                  type="text"
                  className="shadcn-input with-prefix"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Aryan Sharma"
                  required
                />
              </div>
            </div>

            <div className="shadcn-input-group">
              <label htmlFor="edit-phone" className="shadcn-label">
                Contact Phone Number
              </label>
              <div className="input-with-icon">
                <span className="input-prefix-icon">
                  <IconPhone size={16} color="#64748B" />
                </span>
                <input
                  id="edit-phone"
                  type="tel"
                  className="shadcn-input with-prefix"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Locked Fields: Institutional Email & Roll Number / Coordinator Protected */}
          <div className="locked-fields-box">
            <div className="locked-header">
              <IconLock size={14} color="#C6822E" />
              <span>COORDINATOR-VERIFIED ACADEMIC RECORDS (LOCKED)</span>
            </div>

            <div className="form-grid-2col">
              <div className="shadcn-input-group">
                <label className="shadcn-label locked-label">
                  Institutional Email
                  <span className="locked-tag">Locked</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-prefix-icon">
                    <IconMail size={16} color="#94A3B8" />
                  </span>
                  <input
                    type="email"
                    className="shadcn-input with-prefix input-disabled"
                    value={currentUser?.email || ''}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              <div className="shadcn-input-group">
                <label className="shadcn-label locked-label">
                  Roll / ID Number
                  <span className="locked-tag">Locked</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-prefix-icon">
                    <IconBadgeId size={16} color="#94A3B8" />
                  </span>
                  <input
                    type="text"
                    className="shadcn-input with-prefix input-disabled"
                    value={currentUser?.rollNumber || 'VERIFIED-MEMBER'}
                    disabled
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="locked-info-note">
              <IconInfo size={14} color="#64748B" />
              <span>Email & Roll Number are cryptographically bound to institutional records. Contact your Coordinator to request updates.</span>
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
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
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
