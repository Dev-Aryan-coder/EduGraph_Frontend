import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import sharedService from '../../services/sharedService'
import api from '../../services/api'
import {
  IconBell,
  IconSearch,
  IconPlus,
  IconArrowLeft,
  IconCheck,
  IconX,
  IconClock,
  IconAlertTriangle
} from '../../components/common/Icons'
import './NoticeBoard.css'

export default function NoticeBoard({ onBack }) {
  const [currentUser] = useState(() => authService.getStoredUser())
  const [notices, setNotices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('ALL')

  // Create Notice Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [noticeTitle, setNoticeTitle] = useState('')
  const [noticeContent, setNoticeContent] = useState('')
  const [noticePriority, setNoticePriority] = useState('GENERAL')
  const [isPublishing, setIsPublishing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = async () => {
    setIsLoading(true)
    try {
      const data = await sharedService.getMyNotices()
      setNotices(data || [])
    } catch (err) {
      console.error('Error fetching notices:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const role = (currentUser?.role || '').toUpperCase()
  const canPublish = ['ADMIN', 'ROLE_ADMIN', 'PRINCIPAL', 'ROLE_PRINCIPAL', 'COORDINATOR', 'ROLE_COORDINATOR', 'TEACHER', 'ROLE_TEACHER'].includes(role)

  const handlePublishNotice = async (e) => {
    e.preventDefault()
    if (!noticeTitle.trim() || !noticeContent.trim()) return

    setIsPublishing(true)
    setErrorMessage('')
    try {
      await api.post('/notices', {
        title: noticeTitle.trim(),
        content: noticeContent.trim(),
        priority: noticePriority
      })
      setIsModalOpen(false)
      setNoticeTitle('')
      setNoticeContent('')
      loadNotices()
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to broadcast notice.')
    } finally {
      setIsPublishing(false)
    }
  }

  const filteredNotices = notices.filter(n => {
    const matchesSearch =
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    if (priorityFilter === 'ALL') return true
    return (n.priority || 'GENERAL').toUpperCase() === priorityFilter
  })

  return (
    <div className="notice-board-root">
      {/* Top Header */}
      <header className="notice-board-header">
        <div className="notice-header-left">
          {onBack && (
            <button className="notice-back-btn" onClick={onBack}>
              <IconArrowLeft size={16} /> Back
            </button>
          )}
          <div className="notice-title-box">
            <h2>Campus Notice Board</h2>
            <p>Official announcements, academic schedules, and institutional directives</p>
          </div>
        </div>

        {canPublish && (
          <div className="notice-header-right">
            <button className="btn-publish-notice" onClick={() => setIsModalOpen(true)}>
              <IconPlus size={16} /> Broadcast Notice
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="notice-content-container">
        {/* Filter Bar */}
        <div className="notice-toolbar">
          <div className="notice-search-wrap">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="notice-pills">
            {['ALL', 'URGENT', 'ACADEMIC', 'EXAM', 'GENERAL'].map(p => (
              <button
                key={p}
                className={`notice-filter-pill ${priorityFilter === p ? 'active' : ''}`}
                onClick={() => setPriorityFilter(p)}
              >
                {p === 'ALL' ? 'All Notices' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Stream */}
        {isLoading ? (
          <div className="notices-loading">
            <div className="quiz-spinner" />
            <p>Loading institutional notice feed...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="notices-empty">
            <IconBell size={44} color="#94A3B8" />
            <h3>No Notices Found</h3>
            <p>There are no announcements currently matching your filter.</p>
          </div>
        ) : (
          <div className="notices-stream">
            {filteredNotices.map(notice => {
              const priority = (notice.priority || 'GENERAL').toUpperCase()
              return (
                <article key={notice.id} className="notice-card">
                  <div className="notice-card-top">
                    <span className={`notice-badge-priority priority-${priority.toLowerCase()}`}>
                      {priority}
                    </span>
                    <span className="notice-timestamp">
                      <IconClock size={13} />
                      {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h3 className="notice-card-title">{notice.title}</h3>
                  <p className="notice-card-body">{notice.content}</p>

                  <div className="notice-card-footer">
                    <span className="notice-author">
                      Issued by: <strong>{notice.authorName || 'Campus Administration'}</strong>
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="notice-modal-card">
            <div className="modal-header">
              <h3>Broadcast Campus Notice</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <IconX size={18} />
              </button>
            </div>

            {errorMessage && (
              <div className="notice-modal-alert">
                <IconAlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePublishNotice} className="notice-modal-form">
              <div className="form-group">
                <label>Notice Classification *</label>
                <select
                  className="notice-input"
                  value={noticePriority}
                  onChange={(e) => setNoticePriority(e.target.value)}
                >
                  <option value="GENERAL">General Notice</option>
                  <option value="ACADEMIC">Academic Directive</option>
                  <option value="EXAM">Examination Schedule</option>
                  <option value="URGENT">Urgent / Important Alert</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notice Title / Subject *</label>
                <input
                  type="text"
                  className="notice-input"
                  placeholder="e.g. Midterm Examination Schedule Released"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Official Notice Body *</label>
                <textarea
                  className="notice-textarea"
                  placeholder="Write the complete announcement text..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPublishing}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={isPublishing}>
                  {isPublishing ? 'Broadcasting...' : (
                    <>
                      <IconCheck size={16} /> Broadcast to College
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}