import React, { useState } from 'react'
import coordinatorService from '../../services/coordinatorService'
import {
  IconGraduation,
  IconSearch,
  IconUser,
  IconCheck,
  IconX,
  IconPlus,
  IconBolt
} from '../../components/common/Icons'
import './ClassroomManager.css'

export default function ClassroomManager({
  classrooms = [],
  teachers = [],
  isLoading = false,
  onRefresh
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // New Classroom Form
  const [name, setName] = useState('')
  const [section, setSection] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Edit Classroom State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editSection, setEditSection] = useState('')
  const [editTeacherId, setEditTeacherId] = useState('')
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [editErrorMessage, setEditErrorMessage] = useState('')
  const [editSuccessMessage, setEditSuccessMessage] = useState('')

  const handleOpenEditModal = (c) => {
    setEditId(c.id)
    setEditName(c.name || '')
    setEditSection(c.section || '')
    setEditTeacherId(c.teacherId ? String(c.teacherId) : '')
    setEditErrorMessage('')
    setEditSuccessMessage('')
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    if (isEditSubmitting) return
    setIsEditModalOpen(false)
  }

  const handleUpdateClassroom = async (e) => {
    e.preventDefault()
    setEditErrorMessage('')
    setEditSuccessMessage('')

    if (!editName.trim()) {
      setEditErrorMessage('Classroom name is required.')
      return
    }

    setIsEditSubmitting(true)
    try {
      await coordinatorService.updateClassroom(editId, {
        name: editName.trim(),
        section: editSection.trim() || null,
        academicYear: '2026-2027',
        teacherId: editTeacherId ? Number(editTeacherId) : null
      })

      setEditSuccessMessage('Classroom updated & faculty assigned successfully!')
      if (onRefresh) await onRefresh()

      setTimeout(() => {
        setIsEditModalOpen(false)
        setEditSuccessMessage('')
      }, 1400)
    } catch (err) {
      setEditErrorMessage(
        err.response?.data?.message || err.message || 'Failed to update classroom.'
      )
    } finally {
      setIsEditSubmitting(false)
    }
  }

  const filteredClassrooms = classrooms.filter((c) => {
    const q = searchQuery.toLowerCase()
    const matchName = c.name && c.name.toLowerCase().includes(q)
    const matchSection = c.section && c.section.toLowerCase().includes(q)
    const matchTeacher = c.teacherName && c.teacherName.toLowerCase().includes(q)
    return matchName || matchSection || matchTeacher
  })

  const handleOpenModal = () => {
    setName('')
    setSection('')
    setTeacherId('')
    setErrorMessage('')
    setSuccessMessage('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (isSubmitting) return
    setIsModalOpen(false)
  }

  const handleCreateClassroom = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!name.trim()) {
      setErrorMessage('Classroom name is required.')
      return
    }

    setIsSubmitting(true)
    try {
      await coordinatorService.createClassroom({
        name: name.trim(),
        section: section.trim() || null,
        academicYear: '2026-2027',
        teacherId: teacherId ? Number(teacherId) : null
      })

      setSuccessMessage('Classroom created successfully!')
      if (onRefresh) await onRefresh()

      setTimeout(() => {
        setIsModalOpen(false)
      }, 1200)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to create classroom.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClassroom = async (id, cName) => {
    if (!window.confirm(`Are you sure you want to delete classroom "${cName}"?`)) {
      return
    }

    try {
      await coordinatorService.deleteClassroom(id)
      if (onRefresh) onRefresh()
    } catch (err) {
      alert('Failed to delete classroom: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="classroom-manager-module">
      {/* Header */}
      <div className="crm-header-row">
        <div>
          <div className="crm-title-tag">
            <IconGraduation size={15} color="#1B7F72" />
            <span>COURSE SECTIONS & BATCHES</span>
          </div>
          <h1 className="crm-title">Classrooms & Academic Divisions</h1>
          <p className="crm-sub">
            Configure classes, allocate instructors, and monitor enrolled student batches.
          </p>
        </div>

        <div className="crm-header-actions">
          {onRefresh && (
            <button
              type="button"
              className="crm-refresh-btn"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <IconBolt size={14} />
              <span>{isLoading ? 'Updating...' : 'Refresh List'}</span>
            </button>
          )}

          <button
            type="button"
            className="crm-create-btn"
            onClick={handleOpenModal}
          >
            <IconPlus size={16} />
            <span>Add Classroom / Batch</span>
          </button>
        </div>
      </div>

      {/* Metric Highlight Bar */}
      <div className="crm-metrics-bar">
        <div className="crm-metric-item">
          <span className="crm-m-val">{classrooms.length}</span>
          <span className="crm-m-label">Active Classrooms</span>
        </div>
        <div className="crm-metric-divider" />
        <div className="crm-metric-item">
          <span className="crm-m-val">
            {classrooms.reduce((acc, curr) => acc + (curr.studentCount || 0), 0)}
          </span>
          <span className="crm-m-label">Enrolled Students</span>
        </div>
        <div className="crm-metric-divider" />
        <div className="crm-metric-item">
          <span className="crm-m-val">{teachers.length}</span>
          <span className="crm-m-label">Available Faculty</span>
        </div>
      </div>

      {/* Main Panel Card */}
      <div className="crm-panel-card">
        {/* Controls */}
        <div className="crm-controls-bar">
          <div className="crm-search-wrap">
            <IconSearch size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Search by class name, section, or teacher..."
              className="crm-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="crm-clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>
          <span className="crm-count-tag">
            Showing {filteredClassrooms.length} of {classrooms.length} sections
          </span>
        </div>

        {/* Content Table or Empty */}
        {isLoading ? (
          <div className="crm-loading-box">
            <span className="crm-spinner" />
            <p>Fetching classrooms from database...</p>
          </div>
        ) : filteredClassrooms.length > 0 ? (
          <div className="crm-table-responsive">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Classroom Name</th>
                  <th>Section / Batch</th>
                  <th>Assigned Faculty</th>
                  <th>Enrolled Students</th>
                  <th>Database ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClassrooms.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="crm-name-cell">
                        <div className="crm-icon-box">
                          <IconGraduation size={18} color="#1B7F72" />
                        </div>
                        <strong className="crm-class-title">{c.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="crm-section-pill">
                        {c.section || 'General'}
                      </span>
                    </td>
                    <td>
                      {c.teacherName ? (
                        <div className="crm-teacher-meta">
                          <IconUser size={13} color="#1B7F72" />
                          <span>{c.teacherName}</span>
                        </div>
                      ) : (
                        <span className="crm-unassigned">Not Assigned</span>
                      )}
                    </td>
                    <td>
                      <span className="crm-badge-students">
                        {c.studentCount || 0} Students
                      </span>
                    </td>
                    <td>
                      <code>CLASS-#{c.id}</code>
                    </td>
                    <td className="crm-actions-cell">
                      <button
                        type="button"
                        className="crm-edit-btn"
                        onClick={() => handleOpenEditModal(c)}
                        title="Edit Classroom Details & Assign Faculty"
                      >
                        Edit / Assign
                      </button>
                      <button
                        type="button"
                        className="crm-delete-btn"
                        onClick={() => handleDeleteClassroom(c.id, c.name)}
                        title="Delete Classroom"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : classrooms.length > 0 ? (
          <div className="crm-empty-box">
            <div className="crm-empty-icon">
              <IconSearch size={28} color="#94A3B8" />
            </div>
            <h4>No Classrooms Match "{searchQuery}"</h4>
            <p>Try searching for a different class name or division.</p>
          </div>
        ) : (
          <div className="crm-empty-box">
            <div className="crm-empty-icon">
              <IconGraduation size={36} color="#94A3B8" />
            </div>
            <h4>No Classrooms Created Yet</h4>
            <p>
              Create academic course sections and assign faculty to begin enrolling students.
            </p>
            <button
              type="button"
              className="crm-create-first-btn"
              onClick={handleOpenModal}
            >
              + Create First Classroom
            </button>
          </div>
        )}
      </div>

      {/* Create Classroom Modal */}
      {isModalOpen && (
        <div className="crm-modal-overlay" onClick={handleCloseModal}>
          <div className="crm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="crm-modal-head">
              <div>
                <h3 className="crm-modal-title">Create Course Classroom</h3>
                <p className="crm-modal-sub">
                  Set up a new course batch or division for your department.
                </p>
              </div>
              <button
                type="button"
                className="crm-modal-close"
                onClick={handleCloseModal}
              >
                <IconX size={18} />
              </button>
            </div>

            {errorMessage && (
              <div className="crm-alert alert-error">
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="crm-alert alert-success">
                <IconCheck size={16} color="#16A34A" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateClassroom} className="crm-form">
              <div className="crm-input-group">
                <label className="crm-label">Classroom Name *</label>
                <input
                  type="text"
                  className="crm-input"
                  placeholder="e.g. Information Technology - Final Year"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="crm-input-group">
                <label className="crm-label">Section / Division (Optional)</label>
                <input
                  type="text"
                  className="crm-input"
                  placeholder="e.g. Division A / Batch 1"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </div>

              <div className="crm-input-group">
                <label className="crm-label">Assign Faculty Instructor</label>
                <select
                  className="crm-select"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                >
                  <option value="">-- Leave Unassigned for Now --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.email})
                    </option>
                  ))}
                </select>
                {teachers.length === 0 && (
                  <span className="crm-help-note">
                    No faculty onboarded yet. You can assign faculty anytime later.
                  </span>
                )}
              </div>

              <div className="crm-modal-footer">
                <button
                  type="button"
                  className="crm-btn-cancel"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="crm-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Classroom...' : 'Create Classroom ➔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Classroom & Faculty Assignment Modal */}
      {isEditModalOpen && (
        <div className="crm-modal-overlay" onClick={handleCloseEditModal}>
          <div className="crm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="crm-modal-head">
              <div>
                <h3 className="crm-modal-title">Edit Classroom & Faculty Assignment</h3>
                <p className="crm-modal-sub">
                  Update section details and allocate an onboarded faculty instructor.
                </p>
              </div>
              <button
                type="button"
                className="crm-modal-close"
                onClick={handleCloseEditModal}
                disabled={isEditSubmitting}
                aria-label="Close"
              >
                <IconX size={18} />
              </button>
            </div>

            {editErrorMessage && (
              <div className="crm-alert alert-error">
                <span>{editErrorMessage}</span>
              </div>
            )}
            {editSuccessMessage && (
              <div className="crm-alert alert-success">
                <IconCheck size={16} color="#16A34A" />
                <span>{editSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdateClassroom} className="crm-form">
              <div className="crm-input-group">
                <label className="crm-label">Classroom Name *</label>
                <input
                  type="text"
                  className="crm-input"
                  placeholder="e.g. Information Technology - Final Year"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="crm-input-group">
                <label className="crm-label">Section / Division (Optional)</label>
                <input
                  type="text"
                  className="crm-input"
                  placeholder="e.g. Division A / Batch 1"
                  value={editSection}
                  onChange={(e) => setEditSection(e.target.value)}
                />
              </div>

              <div className="crm-input-group">
                <label className="crm-label">Assign Faculty Instructor</label>
                <select
                  className="crm-select"
                  value={editTeacherId}
                  onChange={(e) => setEditTeacherId(e.target.value)}
                >
                  <option value="">-- Leave Unassigned (No Faculty) --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.email})
                    </option>
                  ))}
                </select>
                {teachers.length === 0 ? (
                  <span className="crm-help-note">
                    No faculty onboarded yet. You can onboard faculty via Excel in the Faculty Directory.
                  </span>
                ) : (
                  <span className="crm-help-note">
                    The assigned instructor will immediately be able to publish assignments & grade this section.
                  </span>
                )}
              </div>

              <div className="crm-modal-footer">
                <button
                  type="button"
                  className="crm-btn-cancel"
                  onClick={handleCloseEditModal}
                  disabled={isEditSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="crm-btn-submit"
                  disabled={isEditSubmitting}
                >
                  {isEditSubmitting ? 'Saving Changes...' : 'Save & Assign Faculty ➔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}