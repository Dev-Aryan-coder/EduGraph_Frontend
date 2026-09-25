import React, { useState, useEffect } from 'react'
import sharedService from '../../services/sharedService'
import {
  IconWrench,
  IconPlus,
  IconArrowLeft,
  IconCheck,
  IconX,
  IconClock,
  IconShield,
  IconAlertTriangle,
  IconSearch
} from '../../components/common/Icons'
import './HelpDesk.css'

export default function HelpDesk({ onBack }) {
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // New Ticket Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [ticketType, setTicketType] = useState('DATA_CORRECTION')
  const [targetRole, setTargetRole] = useState('COORDINATOR')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setIsLoading(true)
    try {
      const data = await sharedService.getMyTickets()
      setTickets(data || [])
    } catch (err) {
      console.error('Error fetching tickets:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) return

    setIsSubmitting(true)
    setErrorMessage('')
    try {
      await sharedService.createTicket({
        subject: subject.trim(),
        description: description.trim(),
        ticketType,
        targetRole
      })
      setIsModalOpen(false)
      setSubject('')
      setDescription('')
      loadTickets()
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit ticket.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    if (statusFilter === 'ALL') return true
    return (t.status || 'OPEN').toUpperCase() === statusFilter
  })

  return (
    <div className="helpdesk-root">
      {/* Top Header */}
      <header className="helpdesk-header">
        <div className="helpdesk-header-left">
          {onBack && (
            <button className="helpdesk-back-btn" onClick={onBack}>
              <IconArrowLeft size={16} /> Back
            </button>
          )}
          <div className="helpdesk-title-wrap">
            <h2>Institutional Help Desk & Support</h2>
            <p>File academic data corrections or permission overrides directly to authorities</p>
          </div>
        </div>

        <div className="helpdesk-header-right">
          <button className="btn-new-ticket" onClick={() => setIsModalOpen(true)}>
            <IconPlus size={16} /> Submit Support Ticket
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="helpdesk-content-container">
        {/* Filter Toolbar */}
        <div className="helpdesk-toolbar">
          <div className="helpdesk-search-wrap">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search your tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="helpdesk-pills">
            {['ALL', 'OPEN', 'RESOLVED', 'REJECTED'].map(st => (
              <button
                key={st}
                className={`helpdesk-filter-pill ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'ALL' ? 'All Tickets' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        {isLoading ? (
          <div className="helpdesk-loading">
            <div className="quiz-spinner" />
            <p>Loading support tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="helpdesk-empty">
            <IconWrench size={44} color="#94A3B8" />
            <h3>No Support Tickets Found</h3>
            <p>You have no tickets currently matching your criteria.</p>
            <button className="btn-new-ticket" onClick={() => setIsModalOpen(true)}>
              <IconPlus size={16} /> Create Support Ticket
            </button>
          </div>
        ) : (
          <div className="tickets-stream">
            {filteredTickets.map(t => {
              const status = (t.status || 'OPEN').toUpperCase()
              return (
                <div key={t.id} className="ticket-item-card">
                  <div className="ticket-item-head">
                    <div className="ticket-badges-wrap">
                      <span className={`status-pill pill-${status.toLowerCase()}`}>
                        {status}
                      </span>
                      <span className="type-pill">
                        {t.ticketType?.replace('_', ' ') || 'SUPPORT'}
                      </span>
                    </div>

                    <span className="ticket-date">
                      <IconClock size={13} />
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h3 className="ticket-item-title">{t.subject}</h3>
                  <p className="ticket-item-desc">{t.description}</p>

                  <div className="ticket-item-footer">
                    <span className="target-authority-tag">
                      Assigned to: <strong>{t.targetRole}</strong>
                    </span>
                    {t.assignedToName && (
                      <span className="assignee-name">Reviewed by: {t.assignedToName}</span>
                    )}
                  </div>

                  {t.resolutionNotes && (
                    <div className="ticket-resolution-banner">
                      <IconCheck size={16} color="#10B981" />
                      <div>
                        <strong>Resolution Decision:</strong>
                        <p>{t.resolutionNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="helpdesk-modal-card">
            <div className="modal-header">
              <h3>Submit Support Request</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <IconX size={18} />
              </button>
            </div>

            {errorMessage && (
              <div className="helpdesk-modal-alert">
                <IconAlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="helpdesk-modal-form">
              <div className="form-group">
                <label>Recipient Authority *</label>
                <select
                  className="helpdesk-input"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="COORDINATOR">Academic Coordinator (Roster & Course Data)</option>
                  <option value="ADMIN">Super Administrator (Permissions & Accounts)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Request Category *</label>
                <select
                  className="helpdesk-input"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                >
                  <option value="DATA_CORRECTION">Data Correction (Classroom / Roll Number)</option>
                  <option value="PERMISSION_OVERRIDE">Permission Override / System Access</option>
                </select>
              </div>

              <div className="form-group">
                <label>Subject / Summary *</label>
                <input
                  type="text"
                  className="helpdesk-input"
                  placeholder="e.g. Inaccurate classroom assignment or roster mismatch"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Detailed Explanation *</label>
                <textarea
                  className="helpdesk-textarea"
                  placeholder="Clearly describe the discrepancy or issue requiring administrative attention..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      <IconCheck size={16} /> File Ticket
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