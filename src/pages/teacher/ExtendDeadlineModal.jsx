import React, { useState } from 'react'
import teacherService from '../../services/teacherService'
import { IconClock, IconX, IconCheck } from '../../components/common/Icons'
import './ExtendDeadlineModal.css'

export default function ExtendDeadlineModal({ assignment, isOpen, onClose, onSuccess }) {
  const [extensionHours, setExtensionHours] = useState(24)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen || !assignment) return null

  // Calculate new projected deadline
  const currentDeadline = new Date(assignment.deadline)
  const projectedDeadline = new Date(currentDeadline.getTime() + extensionHours * 60 * 60 * 1000)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!reason.trim()) {
      setErrorMessage('A mandatory logged justification reason is required.')
      return
    }

    if (extensionHours < 1 || extensionHours > 48) {
      setErrorMessage('Extension must be between 1 and 48 hours (maximum 2 days).')
      return
    }

    setIsSubmitting(true)
    try {
      await teacherService.extendDeadline(assignment.id, {
        extensionHours: Number(extensionHours),
        reason: reason.trim()
      })
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to extend deadline.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="edm-overlay" onClick={onClose}>
      <div className="edm-card" onClick={(e) => e.stopPropagation()}>
        <div className="edm-header">
          <div className="edm-header-title">
            <div className="edm-icon-box">
              <IconClock size={20} color="#1B7F72" />
            </div>
            <div>
              <h3>Extend Assignment Deadline</h3>
              <p>Maximum permitted extension is up to 48 hours (2 days) with logged audit trail.</p>
            </div>
          </div>
          <button type="button" className="edm-close-btn" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="edm-alert edm-alert-error">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="edm-form">
          <div className="edm-meta-box">
            <div className="edm-meta-row">
              <span className="edm-meta-label">Assignment:</span>
              <span className="edm-meta-val font-semibold">{assignment.title}</span>
            </div>
            <div className="edm-meta-row">
              <span className="edm-meta-label">Current Deadline:</span>
              <span className="edm-meta-val">{currentDeadline.toLocaleString()}</span>
            </div>
            <div className="edm-meta-row">
              <span className="edm-meta-label">New Projected Deadline:</span>
              <span className="edm-meta-val edm-highlight">{projectedDeadline.toLocaleString()}</span>
            </div>
          </div>

          <div className="edm-form-group">
            <label className="edm-label">Extension Duration (Hours) *</label>
            <div className="edm-presets-row">
              {[6, 12, 24, 48].map((h) => (
                <button
                  key={h}
                  type="button"
                  className={`edm-preset-btn ${extensionHours === h ? 'active' : ''}`}
                  onClick={() => setExtensionHours(h)}
                >
                  +{h} Hours {h === 24 ? '(1 Day)' : h === 48 ? '(2 Days)' : ''}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              max="48"
              className="edm-input"
              value={extensionHours}
              onChange={(e) => setExtensionHours(Number(e.target.value))}
              required
            />
          </div>

          <div className="edm-form-group">
            <label className="edm-label">Mandatory Reason / Justification *</label>
            <textarea
              className="edm-textarea"
              placeholder="e.g. Server maintenance window during submission hour, or extension requested for annual tech symposium."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <span className="edm-hint">
              This reason is sent via email to enrolled students and logged for institutional compliance.
            </span>
          </div>

          <div className="edm-footer">
            <button
              type="button"
              className="edm-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edm-btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Extending...' : 'Confirm Deadline Extension ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}