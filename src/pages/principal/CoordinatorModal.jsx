import React, { useState } from 'react'
import principalService from '../../services/principalService'
import {
  IconUser,
  IconMail,
  IconPhone,
  IconCheck,
  IconX,
  IconShield
} from '../../components/common/Icons'
import './CoordinatorModal.css'

export default function CoordinatorModal({ isOpen, onClose, onCoordinatorAdded }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  if (!isOpen) return null

  const handleClose = () => {
    if (isLoading) return
    setErrorMessage('')
    setSuccessMessage('')
    setFullName('')
    setEmail('')
    setPhoneNumber('')
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Please fill in both coordinator full legal name and institutional email.')
      return
    }

    setIsLoading(true)

    try {
      await principalService.createCoordinator({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || null
      })

      setSuccessMessage(
        `Coordinator appointed! Real login credentials dispatched to ${email.trim()} via SMTP.`
      )
      setFullName('')
      setEmail('')
      setPhoneNumber('')

      if (onCoordinatorAdded) {
        await onCoordinatorAdded()
      }

      setTimeout(() => {
        setSuccessMessage('')
        onClose()
      }, 1800)
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed to appoint coordinator. Please check backend.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="coord-dialog-overlay" onClick={handleClose}>
      <div className="coord-dialog-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="coord-dialog-header">
          <div className="coord-dialog-title-row">
            <div className="coord-dialog-badge">
              <IconShield size={14} color="#1B7F72" />
              <span>APPOINT COORDINATOR</span>
            </div>
            <button
              type="button"
              className="coord-close-btn"
              onClick={handleClose}
              disabled={isLoading}
              aria-label="Close"
            >
              <IconX size={18} />
            </button>
          </div>
          <h2 className="coord-dialog-title">Appoint Academic Coordinator</h2>
          <p className="coord-dialog-description">
            Enter coordinator details. EduGraph will create their database record and dispatch real login credentials to their email via SMTP.
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="coord-alert alert-error">
            <span className="coord-alert-dot" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="coord-alert alert-success">
            <IconCheck size={16} color="#16A34A" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Appointment Form */}
        <form onSubmit={handleSubmit} className="coord-form">
          <div className="coord-input-group">
            <label className="coord-label">Coordinator Full Legal Name *</label>
            <div className="coord-input-wrapper">
              <span className="coord-input-icon">
                <IconUser size={16} color="#64748B" />
              </span>
              <input
                type="text"
                className="coord-input"
                placeholder="e.g. Prof. Alok Verma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="coord-input-group">
            <label className="coord-label">Institutional Email *</label>
            <div className="coord-input-wrapper">
              <span className="coord-input-icon">
                <IconMail size={16} color="#64748B" />
              </span>
              <input
                type="email"
                className="coord-input"
                placeholder="e.g. alok.verma@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <span className="coord-help-text">
              Real credentials will be sent to this email directly via Gmail SMTP.
            </span>
          </div>

          <div className="coord-input-group">
            <label className="coord-label">Phone Number (Optional)</label>
            <div className="coord-input-wrapper">
              <span className="coord-input-icon">
                <IconPhone size={16} color="#64748B" />
              </span>
              <input
                type="tel"
                className="coord-input"
                placeholder="e.g. +91 98123 45678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="coord-dialog-footer">
            <button
              type="button"
              className="coord-btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="coord-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="coord-spinner" />
                  <span>Dispatching Credentials...</span>
                </>
              ) : (
                <>
                  <span>Appoint & Dispatch Email</span>
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