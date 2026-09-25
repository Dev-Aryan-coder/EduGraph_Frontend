import React, { useState } from 'react'
import coordinatorService from '../../services/coordinatorService'
import {
  IconGraduation,
  IconUser,
  IconCheck,
  IconX,
  IconFileText,
  IconBolt
} from '../../components/common/Icons'
import './ExcelImportModal.css'

export default function ExcelImportModal({
  isOpen,
  onClose,
  targetType = 'STUDENT', // 'STUDENT' or 'TEACHER'
  classrooms = [],
  onImportSuccess
}) {
  const [file, setFile] = useState(null)
  const [selectedClassroomId, setSelectedClassroomId] = useState('')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  if (!isOpen) return null

  const isStudent = targetType === 'STUDENT'
  const title = isStudent ? 'Batch Student Excel Onboarding' : 'Batch Faculty Excel Onboarding'

  const handleClose = () => {
    if (isPreviewLoading || isConfirmLoading) return
    setFile(null)
    setPreviewData(null)
    setErrorMessage('')
    setSuccessMessage('')
    onClose()
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreviewData(null)
      setErrorMessage('')
    }
  }

  const handleUploadPreview = async (e) => {
    e.preventDefault()
    if (!file) {
      setErrorMessage('Please select an Excel or CSV file to import.')
      return
    }

    if (isStudent && classrooms.length > 0 && !selectedClassroomId) {
      setErrorMessage('Please select a target classroom section for these students.')
      return
    }

    setIsPreviewLoading(true)
    setErrorMessage('')

    try {
      let preview
      if (isStudent) {
        preview = await coordinatorService.previewStudentExcel(file)
      } else {
        preview = await coordinatorService.previewTeacherExcel(file)
      }

      setPreviewData(preview)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to parse Excel file.')
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const handleConfirmImport = async () => {
    if (!previewData?.rows || previewData.rows.length === 0) return

    setIsConfirmLoading(true)
    setErrorMessage('')

    try {
      const confirmPayload = {
        classroomId: selectedClassroomId ? Number(selectedClassroomId) : null,
        users: previewData.rows.map((r) => ({
          fullName: r.fullName,
          email: r.email,
          rollNumber: r.rollNumber || null,
          phoneNumber: r.phoneNumber || null,
          initialPassword: r.initialPassword || null
        }))
      }

      let count
      if (isStudent) {
        count = await coordinatorService.confirmStudentExcel(confirmPayload)
      } else {
        count = await coordinatorService.confirmTeacherExcel(confirmPayload)
      }

      setSuccessMessage(`Successfully registered ${count} ${isStudent ? 'students' : 'teachers'}! Real credentials dispatched via SMTP.`)

      if (onImportSuccess) {
        await onImportSuccess()
      }

      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to complete batch import.')
    } finally {
      setIsConfirmLoading(false)
    }
  }

  return (
    <div className="eim-modal-overlay" onClick={handleClose}>
      <div className="eim-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="eim-modal-head">
          <div>
            <div className="eim-head-tag">
              <IconFileText size={14} color="#1B7F72" />
              <span>BATCH IMPORT SYSTEM</span>
            </div>
            <h3 className="eim-modal-title">{title}</h3>
            <p className="eim-modal-sub">
              Upload an institutional roster. EduGraph will parse rows in memory, verify uniqueness, and dispatch login credentials.
            </p>
          </div>
          <button
            type="button"
            className="eim-modal-close"
            onClick={handleClose}
            disabled={isPreviewLoading || isConfirmLoading}
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="eim-alert alert-error">
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="eim-alert alert-success">
            <IconCheck size={16} color="#16A34A" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="eim-modal-body">
          {/* Step 1: Upload & Configure */}
          {!previewData ? (
            <form onSubmit={handleUploadPreview} className="eim-upload-form">
              {isStudent && (
                <div className="eim-input-group">
                  <label className="eim-label">Assign to Classroom Section</label>
                  <select
                    className="eim-select"
                    value={selectedClassroomId}
                    onChange={(e) => setSelectedClassroomId(e.target.value)}
                  >
                    <option value="">-- No Classroom Assigned (General Roster) --</option>
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.section ? `(${c.section})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="eim-file-dropzone">
                <input
                  type="file"
                  id="excel-file-input"
                  className="eim-file-hidden"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                />
                <label htmlFor="excel-file-input" className="eim-dropzone-label">
                  <div className="eim-dropzone-icon">
                    <IconFileText size={32} color="#1B7F72" />
                  </div>
                  {file ? (
                    <div>
                      <strong className="eim-filename">{file.name}</strong>
                      <span className="eim-filesize">
                        ({(file.size / 1024).toFixed(1)} KB) • Click to change file
                      </span>
                    </div>
                  ) : (
                    <div>
                      <strong>Click to choose Excel / CSV spreadsheet</strong>
                      <span className="eim-filetypes">Supported formats: .xlsx, .xls, .csv</span>
                    </div>
                  )}
                </label>
              </div>

              <div className="eim-sheet-guidelines">
                <strong>Expected Columns:</strong>
                <ul>
                  <li><code>Full Name</code> (e.g. Rahul Sharma)</li>
                  <li><code>Email</code> (e.g. rahul.sharma@college.edu)</li>
                  {isStudent && <li><code>Roll Number</code> (e.g. IT-2026-042)</li>}
                  <li><code>Phone Number</code> (Optional)</li>
                </ul>
              </div>

              <div className="eim-modal-footer">
                <button
                  type="button"
                  className="eim-btn-cancel"
                  onClick={handleClose}
                  disabled={isPreviewLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="eim-btn-submit"
                  disabled={isPreviewLoading || !file}
                >
                  {isPreviewLoading ? 'Analyzing Sheet...' : 'Parse & Preview Rows ➔'}
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: In-Memory Preview */
            <div className="eim-preview-wrap">
              <div className="eim-preview-stats">
                <div className="eim-p-stat">
                  <span className="eim-stat-num">{previewData.validRowCount || previewData.rows?.length || 0}</span>
                  <span className="eim-stat-label">Valid Candidate Rows</span>
                </div>
                {previewData.errorRowCount > 0 && (
                  <div className="eim-p-stat text-red">
                    <span className="eim-stat-num">{previewData.errorRowCount}</span>
                    <span className="eim-stat-label">Skipped / Invalid Rows</span>
                  </div>
                )}
              </div>

              <div className="eim-preview-table-box">
                <table className="eim-preview-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      {isStudent && <th>Roll Number</th>}
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows?.slice(0, 8).map((row, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td className="font-semibold">{row.fullName}</td>
                        <td>{row.email}</td>
                        {isStudent && <td>{row.rollNumber || 'N/A'}</td>}
                        <td>
                          <span className="eim-badge-ready">● Ready to Enroll</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.rows?.length > 8 && (
                  <div className="eim-more-rows">
                    + {previewData.rows.length - 8} additional candidates verified in memory
                  </div>
                )}
              </div>

              <div className="eim-modal-footer">
                <button
                  type="button"
                  className="eim-btn-cancel"
                  onClick={() => setPreviewData(null)}
                  disabled={isConfirmLoading}
                >
                  ← Choose Different File
                </button>
                <button
                  type="button"
                  className="eim-btn-confirm"
                  onClick={handleConfirmImport}
                  disabled={isConfirmLoading || !previewData.rows?.length}
                >
                  {isConfirmLoading ? (
                    <>
                      <span className="eim-spinner" />
                      <span>Registering & Dispatching Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Commit {previewData.rows?.length || 0} Records</span>
                      <IconCheck size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}