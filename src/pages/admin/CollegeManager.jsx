import React, { useState } from 'react'
import {
  IconInstitution,
  IconSearch,
  IconMail,
  IconCheck,
  IconBolt,
  IconShield
} from '../../components/common/Icons'
import './CollegeManager.css'

export default function CollegeManager({ colleges = [], isLoading = false, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredColleges = colleges.filter((c) => {
    const query = searchQuery.toLowerCase()
    const nameMatch = c.name && c.name.toLowerCase().includes(query)
    const emailMatch = c.contactEmail && c.contactEmail.toLowerCase().includes(query)
    const codeMatch = c.code && c.code.toLowerCase().includes(query)
    return nameMatch || emailMatch || codeMatch
  })

  return (
    <div className="college-manager-module">
      {/* Module Header */}
      <div className="cm-header-row">
        <div>
          <div className="cm-title-tag">
            <IconInstitution size={15} color="#DC2626" />
            <span>CAMPUS NETWORK DIRECTORY</span>
          </div>
          <h1 className="cm-title">Institutions & Colleges Directory</h1>
          <p className="cm-sub">
            Verified university campuses registered in the EduGraph ecosystem, fetched directly from the database.
          </p>
        </div>

        <div className="cm-header-actions">
          {onRefresh && (
            <button
              type="button"
              className="cm-refresh-btn"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <IconBolt size={14} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh Colleges'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="cm-metrics-bar">
        <div className="cm-metric-item">
          <span className="cm-m-val">{colleges.length}</span>
          <span className="cm-m-label">Registered Colleges</span>
        </div>
        <div className="cm-metric-divider" />
        <div className="cm-metric-item">
          <span className="cm-m-val">{colleges.length}</span>
          <span className="cm-m-label">Active Database Nodes</span>
        </div>
        <div className="cm-metric-divider" />
        <div className="cm-metric-item">
          <span className="cm-m-val">100%</span>
          <span className="cm-m-label">Data Authenticity</span>
        </div>
      </div>

      {/* Main Panel Card */}
      <div className="cm-panel-card">
        {/* Controls Bar */}
        <div className="cm-controls-bar">
          <div className="cm-search-wrap">
            <IconSearch size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Search by college name, code, or contact email..."
              className="cm-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="cm-clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>
          <span className="cm-count-tag">
            Showing {filteredColleges.length} of {colleges.length} institutions
          </span>
        </div>

        {/* Content State: Table or Empty */}
        {isLoading ? (
          <div className="cm-loading-box">
            <span className="cm-spinner" />
            <p>Querying verified institutions from database...</p>
          </div>
        ) : filteredColleges.length > 0 ? (
          <div className="cm-table-responsive">
            <table className="cm-table">
              <thead>
                <tr>
                  <th>College Name</th>
                  <th>Campus Address</th>
                  <th>Official Contact</th>
                  <th>Node ID</th>
                  <th>Security Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredColleges.map((college) => (
                  <tr key={college.id}>
                    <td>
                      <div className="cm-name-cell">
                        <div className="cm-icon-box">
                          <IconInstitution size={18} color="#1B7F72" />
                        </div>
                        <div>
                          <strong className="cm-college-name">{college.name}</strong>
                          {college.code && <span className="cm-college-code">Code: {college.code}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cm-cell-text">
                        {college.address || 'Address registered on file'}
                      </span>
                    </td>
                    <td>
                      {college.contactEmail ? (
                        <div className="cm-email-tag">
                          <IconMail size={13} color="#64748B" />
                          <span>{college.contactEmail}</span>
                        </div>
                      ) : (
                        <span className="cm-cell-muted">Not specified</span>
                      )}
                    </td>
                    <td>
                      <code className="cm-code-pill">COLLEGE-#{college.id}</code>
                    </td>
                    <td>
                      <span className="cm-badge-verified">
                        <IconCheck size={12} color="#16A34A" />
                        <span>VERIFIED NODE</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : colleges.length > 0 ? (
          <div className="cm-empty-box">
            <div className="cm-empty-icon">
              <IconSearch size={28} color="#94A3B8" />
            </div>
            <h4>No Institutions Match "{searchQuery}"</h4>
            <p>Try searching for a different college name or contact email.</p>
          </div>
        ) : (
          <div className="cm-empty-box">
            <div className="cm-empty-icon">
              <IconInstitution size={36} color="#94A3B8" />
            </div>
            <h4>No Colleges Registered in Database Yet</h4>
            <p>
              When educational leaders or principals register via the <strong>Sign Up</strong> portal,
              their verified college records will automatically synchronize here with zero delays.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}