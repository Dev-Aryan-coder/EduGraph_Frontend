import React, { useState } from 'react'
import teacherService from '../../services/teacherService'
import EduWhiteboard from '../../components/whiteboard/EduWhiteboard'
import {
  IconGraduation,
  IconCheck,
  IconX,
  IconShield,
  IconBrain,
  IconFileText
} from '../../components/common/Icons'
import './EvaluationModal.css'

export default function EvaluationModal({
  submission,
  isOpen,
  onClose,
  onGraded
}) {
  const [drawingScore, setDrawingScore] = useState(
    submission?.drawingScore !== null && submission?.drawingScore !== undefined
      ? String(submission.drawingScore)
      : '8.5'
  )
  const [feedback, setFeedback] = useState(submission?.teacherFeedback || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  if (!isOpen || !submission) return null

  const tabSwitches = submission.tabSwitchCount || 0
  const mcqScore = submission.mcqScore !== null && submission.mcqScore !== undefined ? submission.mcqScore : 0
  const currentTotal = (Number(drawingScore) || 0) + mcqScore

  let parsedExcalidraw = null
  let studentNotes = submission.content || submission.whiteboardData || ''
  if (submission.excalidrawDrawingData) {
    try {
      const data = JSON.parse(submission.excalidrawDrawingData)
      parsedExcalidraw = data
      if (data.notes) studentNotes = data.notes
    } catch (e) {
      if (!studentNotes) studentNotes = submission.excalidrawDrawingData
    }
  }

  const handleGrade = async (reject = false) => {
    setErrorMessage('')
    setSuccessMessage('')

    if (!reject) {
      const scoreNum = Number(drawingScore)
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
        setErrorMessage('Drawing canvas score must be between 0 and 10.')
        return
      }
    }

    setIsSubmitting(true)
    try {
      await teacherService.gradeSubmission(submission.id, {
        drawingScore: reject ? 0 : Number(drawingScore),
        teacherFeedback: feedback.trim() || (reject ? 'Submission rejected. Please review feedback.' : 'Satisfactory work.'),
        reject
      })

      setSuccessMessage(
        reject
          ? 'Submission marked as REJECTED with feedback.'
          : 'Submission graded successfully! Combined score computed & emailed to student.'
      )

      if (onGraded) onGraded()
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to submit grade.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="eval-overlay" onClick={onClose}>
      <div className="eval-card eval-card-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="eval-header">
          <div className="eval-header-info">
            <div className="eval-badge-wrap">
              <IconGraduation size={18} color="#1B7F72" />
              <span className="eval-title">Whiteboard Submission Evaluation</span>
            </div>
            <p className="eval-subtitle">
              Student: <strong>{submission.studentName || 'Student'}</strong> (Roll: <code>{submission.studentRollNumber || 'N/A'}</code>) • Assignment: {submission.assignmentTitle}
            </p>
          </div>
          <button type="button" className="eval-close-btn" onClick={onClose}>
            <IconX size={20} />
          </button>
        </div>

        {errorMessage && (
          <div className="eval-alert alert-error">
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="eval-alert alert-success">
            <IconCheck size={16} color="#16A34A" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="eval-body">
          {/* Left Column: Submission Work & Audit */}
          <div className="eval-col-preview">
            {/* Anti-cheat Proctoring Banner */}
            <div className={`eval-audit-banner ${tabSwitches > 0 ? 'audit-warn' : 'audit-clean'}`}>
              <div className="audit-icon-box">
                <IconShield size={18} color={tabSwitches > 0 ? '#D97706' : '#16A34A'} />
              </div>
              <div className="audit-meta">
                <h4>Proctoring Security Audit</h4>
                <p>
                  {tabSwitches === 0 ? (
                    <span className="text-green font-semibold">
                      ✓ 0 Tab Switches Recorded — Student stayed focused on assessment canvas.
                    </span>
                  ) : (
                    <span className="text-amber font-semibold">
                      ⚠️ {tabSwitches} Tab-Switch event{tabSwitches > 1 ? 's' : ''} recorded during submission!
                    </span>
                  )}
                </p>
              </div>
              <span className={`audit-badge ${tabSwitches > 0 ? 'badge-amber' : 'badge-green'}`}>
                {tabSwitches === 0 ? 'VERIFIED INTEGRITY' : `${tabSwitches} TAB SWITCHES`}
              </span>
            </div>

            {/* MCQ Assessment Result Card */}
            <div className="eval-metric-strip">
              <div className="eval-m-box">
                <span className="m-label">Automated MCQ Score</span>
                <span className="m-val">{mcqScore} <small>/ 20</small></span>
              </div>
              <div className="eval-m-box">
                <span className="m-label">Canvas Drawing Score</span>
                <span className="m-val">{drawingScore || '0'} <small>/ 10</small></span>
              </div>
              <div className="eval-m-box highlight">
                <span className="m-label">Projected Final Score</span>
                <span className="m-val total">{currentTotal.toFixed(1)} <small>/ 30</small></span>
              </div>
            </div>

            {/* Student Canvas / Content Display */}
            <div className="eval-content-box">
              <div className="eval-content-head">
                <IconFileText size={15} color="#475569" />
                <span>Student Excalidraw Whiteboard Submission</span>
              </div>
              <div className="eval-content-viewport">
                {parsedExcalidraw && (parsedExcalidraw.elements?.length > 0 || Array.isArray(parsedExcalidraw)) ? (
                  <div className="eval-excalidraw-container" style={{ height: 420, width: '100%', position: 'relative' }}>
                    <EduWhiteboard
                      initialData={parsedExcalidraw}
                      viewModeEnabled={true}
                      name={`eval-${submission.id}`}
                    />
                  </div>
                ) : studentNotes ? (
                  <div className="eval-raw-content">
                    <pre>{studentNotes}</pre>
                  </div>
                ) : (
                  <div className="eval-placeholder-content">
                    <IconBrain size={32} color="#94A3B8" />
                    <p>Student submitted graph structures and visual whiteboard diagram.</p>
                    <span className="sub-hint">Drawing metadata recorded on student canvas.</span>
                  </div>
                )}

                {parsedExcalidraw && studentNotes && (
                  <div className="eval-notes-addon" style={{ marginTop: '14px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ fontSize: '0.78rem', color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Accompanying Written Explanation:
                    </strong>
                    <pre style={{ margin: 0, fontSize: '0.82rem', color: '#1E293B', whiteSpace: 'pre-wrap' }}>{studentNotes}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Grading & Feedback Controls */}
          <div className="eval-col-grading">
            <h4 className="grading-title">Faculty Assessment Panel</h4>
            <p className="grading-sub">
              Enter drawing marks out of 10. Final score combines with automated 20 MCQ questions.
            </p>

            <div className="eval-form-group">
              <label className="eval-label">
                Canvas Graph & Diagram Marks (0.0 - 10.0) *
              </label>
              <div className="score-input-wrap">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  className="eval-score-input"
                  value={drawingScore}
                  onChange={(e) => setDrawingScore(e.target.value)}
                  placeholder="e.g. 8.5"
                  required
                />
                <span className="score-denom">/ 10 Marks</span>
              </div>
              <div className="score-quick-presets">
                {[5, 7, 8.5, 9, 10].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="score-preset-btn"
                    onClick={() => setDrawingScore(String(s))}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="eval-form-group">
              <label className="eval-label">Faculty Feedback & Comments</label>
              <textarea
                className="eval-textarea"
                rows={4}
                placeholder="e.g. Excellent conceptual mapping of nodes and clear visual hierarchy. Minor labeling missed on step 3."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div className="eval-actions">
              <button
                type="button"
                className="btn-eval-reject"
                onClick={() => handleGrade(true)}
                disabled={isSubmitting}
                title="Reject submission and request revision"
              >
                Reject Submission
              </button>
              <button
                type="button"
                className="btn-eval-approve"
                onClick={() => handleGrade(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Approve & Save Grade ➔'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}