import React, { useState } from 'react'
import adminService from '../../services/adminService'
import {
  IconBolt,
  IconCheck,
  IconX,
  IconSearch,
  IconUser,
  IconInstitution,
  IconFileText
} from '../../components/common/Icons'
import './GlobalNotices.css'

export default function GlobalNotices({
  notices = [],
  isLoading = false,
  onRefresh,
  onNoticeCreated
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Notice Form State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [targetRole, setTargetRole] = useState('') // empty string for ALL
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const filteredNotices = notices.filter((n) => {
    const query = searchQuery.toLowerCase()
    const matchTitle = n.title && n.title.toLowerCase().includes(query)
    const matchContent = n.content && n.content.toLowerCase().includes(query)
    return matchTitle || matchContent
  })

  const handleOpenModal = () => {
    setTitle('')
    setContent('')
    setTargetRole('')
    setErrorMessage('')
    setSuccessMessage('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handlePublishNotice = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!title.trim() || !content.trim()) {
      setErrorMessage('Notice title and content are both required.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        targetRole: targetRole || null
      }

      await adminService.createNotice(payload)
      setSuccessMessage('Notice broadcasted successfully across the platform!')

      if (onNoticeCreated) {
        await onNoticeCreated()
      } else if (onRefresh) {
        await onRefresh()
      }

      setTimeout(() => {
        setIsModalOpen(false)
      }, 1200)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to broadcast notice.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure you want to retract and remove this platform notice?')) {
      return
    }

    try {
      await adminService.deleteNotice(noticeId)
      if (onRefresh) onRefresh()
    } catch (err) {
      alert('Failed to remove notice: ' + (err.response?.data?.message || err.message))
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="global-notices-module">
      {/* Module Header */}
      <div className="gn-header-row">
        <div>
          <div className="gn-title-tag">
            <IconBolt size={15} color="#DC2626" />
            <span>GLOBAL PLATFORM BROADCASTS</span>
          </div>
          <h1 className="gn-title">Platform Notices & Broadcast Bulletins</h1>
          <p className="gn-sub">
            Publish and manage platform-wide announcements dispatched directly to university dashboards.
          </p>
        </div>

        <div className="gn-header-actions">
          {onRefresh && (
            <button
              type="button"
              className="gn-sync-btn"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <IconBolt size={14} />
              <span>{isLoading ? 'Syncing...' : 'Sync Feed'}</span>
            </button>
          )}

          <button
            type="button"
            className="gn-create-btn"
            onClick={handleOpenModal}
          >
            <span>+ Broadcast New Notice</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="gn-metrics-bar">
        <div className="gn-metric-item">
          <span className="gn-m-val">{notices.length}</span>
          <span className="gn-m-label">Active Broadcasts</span>
        </div>
        <div className="gn-metric-divider" />
        <div className="gn-metric-item">
          <span className="gn-m-val">Real-Time</span>
          <span className="gn-m-label">Feed Dispatch</span>
        </div>
        <div className="gn-metric-divider" />
        <div className="gn-metric-item">
          <span className="gn-m-val">Institutional</span>
          <span className="gn-m-label">Audience Targeting</span>
        </div>
      </div>

      {/* Main Notice List Panel */}
      <div className="gn-panel-card">
        {/* Filter Bar */}
        <div className="gn-controls-bar">
          <div className="gn-search-wrap">
            <IconSearch size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Search announcements by keyword..."
              className="gn-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="gn-clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>
          <span className="gn-count-tag">
            Showing {filteredNotices.length} of {notices.length} announcements
          </span>
        </div>

        {/* List Content */}
        {isLoading ? (
          <div className="gn-loading-box">
            <span className="gn-spinner" />
            <p>Loading real notices from database...</p>
          </div>
        ) : filteredNotices.length > 0 ? (
          <div className="gn-notices-list">
            {filteredNotices.map((n) => (
              <div key={n.id} className="gn-notice-card">
                <div className="gn-card-top">
                  <div className="gn-card-meta">
                    <span className="gn-pill-target">
                      {n.targetRole ? `AUDIENCE: ${n.targetRole}` : 'BROADCAST: ALL ROLES'}
                    </span>
                    <span className="gn-date-tag">{formatDate(n.createdAt)}</span>
                  </div>

                  <button
                    type="button"
                    className="gn-delete-btn"
                    onClick={() => handleDeleteNotice(n.id)}
                    title="Retract Notice"
                  >
                    Delete
                  </button>
                </div>

                <h3 className="gn-notice-title">{n.title}</h3>
                <p className="gn-notice-body">{n.content}</p>

                <div className="gn-card-footer">
                  <div className="gn-author-info">
                    <IconUser size={14} color="#64748B" />
                    <span>Dispatched by: {n.authorName || 'Super Administrator'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notices.length > 0 ? (
          <div className="gn-empty-box">
            <div className="gn-empty-icon">
              <IconSearch size={28} color="#94A3B8" />
            </div>
            <h4>No Notices Match "{searchQuery}"</h4>
            <p>Try searching with another keyword.</p>
          </div>
        ) : (
          <div className="gn-empty-box">
            <div className="gn-empty-icon">
              <IconFileText size={36} color="#94A3B8" />
            </div>
            <h4>No Global Notices Broadcasted Yet</h4>
            <p>
              Broadcast platform announcements, maintenance bulletins, or policy updates to all university campuses from here.
            </p>
            <button
              type="button"
              className="gn-create-first-btn"
              onClick={handleOpenModal}
            >
              + Create First Broadcast
            </button>
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {isModalOpen && (
        <div className="gn-modal-overlay">
          <div className="gn-modal-card">
            <div className="gn-modal-head">
              <div>
                <h3 className="gn-modal-title">Broadcast Platform Notice</h3>
                <p className="gn-modal-sub">
                  This bulletin will be posted in real time to the selected target feed.
                </p>
              </div>
              <button
                type="button"
                className="gn-modal-close"
                onClick={handleCloseModal}
              >
                <IconX size={18} />
              </button>
            </div>

            {errorMessage && (
              <div className="gn-modal-alert alert-error">
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="gn-modal-alert alert-success">
                <IconCheck size={16} color="#16A34A" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handlePublishNotice} className="gn-modal-form">
              <div className="gn-form-group">
                <label className="gn-label">Notice Headline / Subject</label>
                <input
                  type="text"
                  className="gn-input"
                  placeholder="e.g. Scheduled Platform Maintenance Window"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="gn-form-group">
                <label className="gn-label">Target Audience</label>
                <select
                  className="gn-select"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="">All Users (Principals, Teachers, Students, Coordinators)</option>
                  <option value="PRINCIPAL">Principals & Institutional Deans Only</option>
                  <option value="COORDINATOR">Coordinators Only</option>
                  <option value="TEACHER">Faculty & Instructors Only</option>
                  <option value="STUDENT">Students Only</option>
                </select>
              </div>

              <div className="gn-form-group">
                <label className="gn-label">Bulletin Content</label>
                <textarea
                  className="gn-textarea"
                  rows={5}
                  placeholder="Write the detailed bulletin announcement here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="gn-modal-footer">
                <button
                  type="button"
                  className="gn-btn-cancel"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gn-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Broadcasting...' : 'Publish Announcement ➔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}