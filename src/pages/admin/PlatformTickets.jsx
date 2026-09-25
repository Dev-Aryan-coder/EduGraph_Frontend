import React, { useState } from 'react'
import {
  IconShield,
  IconSearch,
  IconCheck,
  IconBolt,
  IconUser,
  IconFileText
} from '../../components/common/Icons'
import './PlatformTickets.css'

export default function PlatformTickets({ tickets = [], isLoading = false, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filteredTickets = tickets.filter((t) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      (t.title && t.title.toLowerCase().includes(query)) ||
      (t.description && t.description.toLowerCase().includes(query)) ||
      (t.createdByName && t.createdByName.toLowerCase().includes(query)) ||
      (t.createdByEmail && t.createdByEmail.toLowerCase().includes(query)) ||
      String(t.id).includes(query)

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = tickets.filter((t) => t.status === 'PENDING').length
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED').length

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="platform-tickets-module">
      {/* Header */}
      <div className="pt-header-row">
        <div>
          <div className="pt-title-tag">
            <IconShield size={15} color="#DC2626" />
            <span>HELPDESK & DATA CORRECTIONS</span>
          </div>
          <h1 className="pt-title">Platform Support & Dispute Tickets</h1>
          <p className="pt-sub">
            Real-time feed of support queries, student roll number corrections, and technical assistance requests.
          </p>
        </div>

        <div className="pt-header-actions">
          {onRefresh && (
            <button
              type="button"
              className="pt-refresh-btn"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <IconBolt size={14} />
              <span>{isLoading ? 'Updating...' : 'Sync Tickets'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="pt-metrics-bar">
        <div className="pt-metric-item">
          <span className="pt-m-val">{tickets.length}</span>
          <span className="pt-m-label">Total Logged Tickets</span>
        </div>
        <div className="pt-metric-divider" />
        <div className="pt-metric-item">
          <span className="pt-m-val text-amber">{pendingCount}</span>
          <span className="pt-m-label">Awaiting Resolution</span>
        </div>
        <div className="pt-metric-divider" />
        <div className="pt-metric-item">
          <span className="pt-m-val text-green">{resolvedCount}</span>
          <span className="pt-m-label">Resolved Issues</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="pt-panel-card">
        {/* Controls */}
        <div className="pt-controls-bar">
          <div className="pt-search-wrap">
            <IconSearch size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Search by ticket title, ID, or user email..."
              className="pt-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="pt-clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>

          <div className="pt-filter-group">
            <select
              className="pt-select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses ({tickets.length})</option>
              <option value="PENDING">Pending Review ({pendingCount})</option>
              <option value="RESOLVED">Resolved ({resolvedCount})</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="pt-loading-box">
            <span className="pt-spinner" />
            <p>Fetching real tickets from database...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="pt-table-responsive">
            <table className="pt-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject & Details</th>
                  <th>Raised By</th>
                  <th>Category</th>
                  <th>Logged Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <code className="pt-code-pill">TICKET-#{t.id}</code>
                    </td>
                    <td>
                      <div className="pt-subject-cell">
                        <strong className="pt-ticket-title">{t.title}</strong>
                        {t.description && (
                          <p className="pt-ticket-desc">{t.description}</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="pt-user-meta">
                        <span className="pt-author-name">{t.createdByName || 'Platform User'}</span>
                        <span className="pt-author-email">{t.createdByEmail || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="pt-tag-type">{t.type || 'SUPPORT'}</span>
                    </td>
                    <td>
                      <span className="pt-date-text">{formatDate(t.createdAt)}</span>
                    </td>
                    <td>
                      <span
                        className={
                          t.status === 'PENDING'
                            ? 'pt-badge-pending'
                            : 'pt-badge-resolved'
                        }
                      >
                        ● {t.status || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : tickets.length > 0 ? (
          <div className="pt-empty-box">
            <div className="pt-empty-icon">
              <IconSearch size={28} color="#94A3B8" />
            </div>
            <h4>No Tickets Match Filter</h4>
            <p>Try resetting the search filter or status selection.</p>
          </div>
        ) : (
          <div className="pt-empty-box">
            <div className="pt-empty-icon">
              <IconShield size={36} color="#94A3B8" />
            </div>
            <h4>No Active Support Tickets in Database</h4>
            <p>
              When students, teachers, or coordinators submit support requests or data correction tickets,
              they will appear here in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}