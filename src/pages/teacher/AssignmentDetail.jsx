import React, { useState, useEffect } from 'react'
import teacherService from '../../services/teacherService'
import EvaluationModal from './EvaluationModal'
import ExtendDeadlineModal from './ExtendDeadlineModal'
import {
  IconGraduation,
  IconArrowLeft,
  IconClock,
  IconCheck,
  IconX,
  IconShield,
  IconBrain,
  IconFileText,
  IconSearch,
  IconTrash
} from '../../components/common/Icons'
import './AssignmentDetail.css'

export default function AssignmentDetail({
  assignmentId,
  onBack,
  onAssignmentDeleted
}) {
  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [mcqs, setMcqs] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('submissions') // 'submissions' | 'mcqs'
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false)
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [assignData, subsData, mcqsData, statsData] = await Promise.all([
        teacherService.getAssignmentById(assignmentId),
        teacherService.getSubmissionsForAssignment(assignmentId),
        teacherService.getAssignmentMCQs(assignmentId),
        teacherService.getAssignmentStats(assignmentId)
      ])

      if (assignData) setAssignment(assignData)
      if (subsData) setSubmissions(subsData)
      if (mcqsData) setMcqs(mcqsData)
      if (statsData) setStats(statsData)
    } catch (err) {
      console.error('Error fetching assignment details:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (assignmentId) {
      loadData()
    }
  }, [assignmentId])

  const handleDeleteAssignment = async () => {
    if (!window.confirm(`Are you sure you want to delete assignment "${assignment?.title}"? This cannot be undone.`)) {
      return
    }
    try {
      await teacherService.deleteAssignment(assignmentId)
      if (onAssignmentDeleted) onAssignmentDeleted(assignmentId)
      onBack()
    } catch (err) {
      alert('Failed to delete assignment: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleOpenEvaluate = (sub) => {
    setSelectedSubmission(sub)
    setIsEvaluationOpen(true)
  }

  if (isLoading && !assignment) {
    return (
      <div className="ad-loading-wrap">
        <span className="ad-spinner" />
        <p>Loading assignment dossier & live submissions...</p>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="ad-empty-wrap">
        <p>Assignment not found or unauthorized access.</p>
        <button type="button" className="btn-ad-back" onClick={onBack}>
          ⮜ Back to Dashboard
        </button>
      </div>
    )
  }

  const deadlineDate = new Date(assignment.deadline)
  const isPastDeadline = deadlineDate < new Date()

  const filteredSubmissions = submissions.filter((s) => {
    const q = searchQuery.toLowerCase()
    const nameMatch = s.studentName && s.studentName.toLowerCase().includes(q)
    const rollMatch = s.studentRollNumber && s.studentRollNumber.toLowerCase().includes(q)
    return nameMatch || rollMatch
  })

  return (
    <div className="ad-container">
      {/* Top Bar */}
      <div className="ad-header-row">
        <button type="button" className="btn-ad-back" onClick={onBack}>
          <IconArrowLeft size={16} />
          <span>Back to All Assignments</span>
        </button>

        <div className="ad-header-actions">
          <button
            type="button"
            className="btn-ad-extend"
            onClick={() => setIsExtendModalOpen(true)}
          >
            <IconClock size={15} />
            <span>Extend Deadline (+48h Max)</span>
          </button>
          <button
            type="button"
            className="btn-ad-delete"
            onClick={handleDeleteAssignment}
          >
            <IconTrash size={15} />
            <span>Delete Assignment</span>
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="ad-card-main">
        <div className="ad-card-top">
          <div className="ad-title-block">
            <div className="ad-icon-box">
              <IconGraduation size={24} color="#1B7F72" />
            </div>
            <div>
              <div className="ad-tags-line">
                <span className="ad-subj-tag">{assignment.subject || 'Coursework'}</span>
                <span className="ad-class-tag">
                  Classroom #{assignment.classroomId}
                </span>
                {isPastDeadline ? (
                  <span className="ad-status-pill closed">● CLOSED</span>
                ) : (
                  <span className="ad-status-pill active">● ACTIVE</span>
                )}
                {assignment.extensionGrantedHours > 0 && (
                  <span className="ad-status-pill extended">
                    +{assignment.extensionGrantedHours}h EXTENDED
                  </span>
                )}
              </div>
              <h1 className="ad-main-title">{assignment.title}</h1>
              <p className="ad-desc">{assignment.description}</p>
            </div>
          </div>
        </div>

        {/* Metric Highlights */}
        <div className="ad-metrics-bar">
          <div className="ad-metric-item">
            <span className="m-val">{submissions.length}</span>
            <span className="m-lbl">Submissions Received</span>
          </div>
          <div className="ad-metric-divider" />
          <div className="ad-metric-item">
            <span className="m-val text-green">
              {submissions.filter(s => s.status === 'EVALUATED').length}
            </span>
            <span className="m-lbl">Evaluated & Graded</span>
          </div>
          <div className="ad-metric-divider" />
          <div className="ad-metric-item">
            <span className="m-val text-amber">
              {submissions.filter(s => s.status === 'SUBMITTED').length}
            </span>
            <span className="m-lbl">Pending Review</span>
          </div>
          <div className="ad-metric-divider" />
          <div className="ad-metric-item">
            <span className="m-val">{mcqs.length || 20}</span>
            <span className="m-lbl">Verification MCQs</span>
          </div>
          <div className="ad-metric-divider" />
          <div className="ad-metric-item">
            <span className="m-val text-teal">
              {deadlineDate.toLocaleDateString()}
            </span>
            <span className="m-lbl">{deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="ad-tabs-nav">
        <button
          type="button"
          className={`ad-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          <IconFileText size={16} />
          <span>Student Submissions Roster ({submissions.length})</span>
        </button>
        <button
          type="button"
          className={`ad-tab-btn ${activeTab === 'mcqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('mcqs')}
        >
          <IconBrain size={16} />
          <span>Authored 20 Verification MCQs ({mcqs.length})</span>
        </button>
      </div>

      {/* TAB 1: SUBMISSIONS ROSTER */}
      {activeTab === 'submissions' && (
        <div className="ad-tab-panel">
          <div className="ad-filter-bar">
            <div className="ad-search-box">
              <IconSearch size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search submission by student name or roll number..."
                className="ad-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="ad-clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>
            <span className="ad-count-info">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </span>
          </div>

          {filteredSubmissions.length > 0 ? (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Submitted At</th>
                    <th>MCQ Score (/20)</th>
                    <th>Drawing Score (/10)</th>
                    <th>Total (/30)</th>
                    <th>Proctoring Audit</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => {
                    const tabSwitches = sub.tabSwitchCount || 0
                    const isGraded = sub.status === 'EVALUATED'
                    const totalScore = (sub.mcqScore || 0) + (sub.drawingScore || 0)

                    return (
                      <tr key={sub.id}>
                        <td className="font-semibold">{sub.studentName}</td>
                        <td>
                          <code className="roll-tag">{sub.studentRollNumber || 'N/A'}</code>
                        </td>
                        <td>
                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'In Progress'}
                        </td>
                        <td>
                          <span className="score-pill">{sub.mcqScore !== null ? `${sub.mcqScore}/20` : '—'}</span>
                        </td>
                        <td>
                          <span className="score-pill">
                            {sub.drawingScore !== null ? `${sub.drawingScore}/10` : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <strong className={isGraded ? 'text-teal' : ''}>
                            {isGraded ? `${totalScore.toFixed(1)}/30` : '—'}
                          </strong>
                        </td>
                        <td>
                          {tabSwitches === 0 ? (
                            <span className="audit-pill clean">✓ 0 Switches</span>
                          ) : (
                            <span className="audit-pill warn">⚠️ {tabSwitches} Switches</span>
                          )}
                        </td>
                        <td>
                          {sub.status === 'EVALUATED' && <span className="badge-status graded">EVALUATED</span>}
                          {sub.status === 'SUBMITTED' && <span className="badge-status pending">PENDING REVIEW</span>}
                          {sub.status === 'REJECTED' && <span className="badge-status rejected">REJECTED</span>}
                          {sub.status === 'IN_PROGRESS' && <span className="badge-status draft">DRAFT</span>}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-evaluate-row"
                            onClick={() => handleOpenEvaluate(sub)}
                          >
                            {isGraded ? 'Re-grade' : 'Grade Canvas ➔'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="ad-empty-box">
              <IconFileText size={32} color="#94A3B8" />
              <h4>No Submissions Yet</h4>
              <p>Students in this classroom will appear here once they start or finalize their whiteboard canvas.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUTHORED 20 MCQs */}
      {activeTab === 'mcqs' && (
        <div className="ad-tab-panel">
          <div className="mcq-cards-grid">
            {mcqs.map((q, idx) => (
              <div key={q.id || idx} className="mcq-preview-card">
                <div className="mcq-card-head">
                  <span className="mcq-qnum">Question {q.questionNumber || idx + 1} of 20</span>
                  <span className="mcq-correct-tag">Answer Key: Option {q.correctOption}</span>
                </div>
                <p className="mcq-qtext">{q.questionText}</p>
                <div className="mcq-options-list">
                  {['A', 'B', 'C', 'D'].map((optKey) => {
                    const isKey = q.correctOption === optKey
                    return (
                      <div
                        key={optKey}
                        className={`mcq-opt-item ${isKey ? 'correct-opt' : ''}`}
                      >
                        <span className="opt-letter-tag">{optKey}</span>
                        <span className="opt-text">{q[`option${optKey}`]}</span>
                        {isKey && <span className="correct-check">✓</span>}
                      </div>
                    )
                  })}
                </div>
                {q.explanation && (
                  <div className="mcq-exp-box">
                    <strong>Rationale:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      {isEvaluationOpen && selectedSubmission && (
        <EvaluationModal
          submission={selectedSubmission}
          isOpen={isEvaluationOpen}
          onClose={() => {
            setIsEvaluationOpen(false)
            setSelectedSubmission(null)
          }}
          onGraded={loadData}
        />
      )}

      {/* Extend Deadline Modal */}
      {isExtendModalOpen && (
        <ExtendDeadlineModal
          assignment={assignment}
          isOpen={isExtendModalOpen}
          onClose={() => setIsExtendModalOpen(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  )
}