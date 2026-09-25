import React, { useState } from 'react'
import studentService from '../../services/studentService'
import { IconShare, IconX, IconCheck, IconMail, IconShield } from '../../components/common/Icons'
import './ShareNodeModal.css'

export default function ShareNodeModal({
  item, // { id, title || subjectName, type: 'node' | 'panel' }
  isOpen,
  onClose,
  onShared
}) {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  if (!isOpen || !item) return null

  const isPanel = item.type === 'panel'
  const displayName = item.title || item.subjectName || 'Item'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!recipientEmail.trim()) {
      setErrorMessage('Please enter the recipient student email.')
      return
    }

    setIsSubmitting(true)
    try {
      if (isPanel) {
        await studentService.sharePanel(item.id, recipientEmail.trim())
      } else {
        await studentService.shareNode(item.id, recipientEmail.trim())
      }
      setSuccessMessage(`Successfully shared "${displayName}" with ${recipientEmail}!`)
      setRecipientEmail('')
      if (onShared) onShared()
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to share item. Verify the student email address.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="share-modal-card">
        <div className="share-modal-header">
          <div className="share-title-wrap">
            <div className="share-icon-box">
              <IconShare size={20} color="#0D9488" />
            </div>
            <div>
              <h3>Share {isPanel ? 'Subject Panel' : 'Topic Node'}</h3>
              <p>Collaborate in view-only mode on <strong>{displayName}</strong></p>
            </div>
          </div>
          <button className="share-btn-close" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="share-alert-error">
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="share-alert-success">
            <IconCheck size={16} color="#16A34A" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="share-form">
          <div className="share-security-note">
            <IconShield size={16} color="#0D9488" />
            <p>
              Shared items are accessible in <strong>read-only mode</strong> to prevent unauthorized overwrites.
            </p>
          </div>

          <div className="share-form-group">
            <label className="share-label">Classmate Student Email Address *</label>
            <div className="share-input-wrap">
              <IconMail size={18} className="share-input-icon" />
              <input
                type="email"
                className="share-input"
                placeholder="e.g. rahul.sharma@college.edu"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>
            <span className="share-hint">
              The recipient must be a registered student in the EduGraph system.
            </span>
          </div>

          <div className="share-actions">
            <button type="button" className="share-btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="share-btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sharing...' : (
                <>
                  <IconShare size={16} /> Share Access
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}