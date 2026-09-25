import React, { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import studentService from '../../services/studentService'
import MCQQuizRunner from './MCQQuizRunner'
import EduWhiteboard from '../../components/whiteboard/EduWhiteboard'
import {
  IconArrowLeft,
  IconShield,
  IconBrain,
  IconCheck,
  IconFileText,
  IconAlertTriangle,
  IconAward
} from '../../components/common/Icons'
import './AssignmentRunner.css'

export default function AssignmentRunner({
  assignmentId,
  onBack,
  onSubmissionComplete
}) {
  const [assignment, setAssignment] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Proctoring State
  const [tabSwitches, setTabSwitches] = useState(0)
  const [showProctorWarning, setShowProctorWarning] = useState(false)

  // Sub-view: Active Whiteboard vs 20-MCQ Quiz
  const [activeView, setActiveView] = useState('whiteboard') // 'whiteboard' | 'quiz'

  // Excalidraw Whiteboard State
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const [initialDrawingData, setInitialDrawingData] = useState(null)
  const [writtenNotes, setWrittenNotes] = useState('')

  // 1. Initial Data Load
  useEffect(() => {
    loadAssignmentAndSubmission()
  }, [assignmentId])

  const loadAssignmentAndSubmission = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const [assignData, subData] = await Promise.all([
        studentService.getAssignmentById(assignmentId),
        studentService.getMySubmission(assignmentId)
      ])
      setAssignment(assignData)
      if (subData) {
        setSubmission(subData)
        setTabSwitches(subData.tabSwitchCount || 0)
        if (subData.excalidrawDrawingData) {
          try {
            const parsed = JSON.parse(subData.excalidrawDrawingData)
            if (parsed.notes) setWrittenNotes(parsed.notes)
            setInitialDrawingData(parsed)
          } catch (e) {
            // Raw string or notes fallback
            setWrittenNotes(subData.excalidrawDrawingData)
          }
        }
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to load assignment data.')
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Proctoring Tab-Switch Listener
  useEffect(() => {
    // Only monitor if not already graded or finalized
    if (submission?.status === 'GRADED') return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const nextCount = prev + 1
          studentService.recordTabSwitch(
            assignmentId,
            `Student navigated away from assignment tab (Event #${nextCount})`
          )
          return nextCount
        })
        setShowProctorWarning(true)
        setTimeout(() => setShowProctorWarning(false), 5000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [assignmentId, submission?.status])

  // 3. Save Draft
  const handleSaveDraft = async () => {
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      let payload = {}
      if (excalidrawAPI) {
        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()
        const files = excalidrawAPI.getFiles()
        payload = {
          elements,
          appState: {
            viewBackgroundColor: appState?.viewBackgroundColor || '#ffffff',
            gridSize: appState?.gridSize || null,
          },
          files,
          notes: writtenNotes,
          lastSaved: new Date().toISOString()
        }
      } else {
        payload = { notes: writtenNotes, lastSaved: new Date().toISOString() }
      }
      const updated = await studentService.saveDrawingDraft(assignmentId, JSON.stringify(payload))
      setSubmission(updated)
      setSuccessMessage('Excalidraw whiteboard draft saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save draft.')
    } finally {
      setIsSaving(false)
    }
  }

  // 4. Finalize Submission
  const handleFinalize = async () => {
    const confirmSubmit = window.confirm(
      'Are you ready to submit your Excalidraw whiteboard drawing? You will proceed directly to the mandatory 20-MCQ Verification Assessment.'
    )
    if (!confirmSubmit) return

    setIsFinalizing(true)
    setErrorMessage('')
    try {
      let payload = {}
      if (excalidrawAPI) {
        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()
        const files = excalidrawAPI.getFiles()
        payload = {
          elements,
          appState: {
            viewBackgroundColor: appState?.viewBackgroundColor || '#ffffff',
            gridSize: appState?.gridSize || null,
          },
          files,
          notes: writtenNotes,
          finalizedAt: new Date().toISOString()
        }
      } else {
        payload = { notes: writtenNotes, finalizedAt: new Date().toISOString() }
      }
      const updated = await studentService.finalizeSubmission(assignmentId, JSON.stringify(payload))
      setSubmission(updated)

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
      } catch (e) {}

      // Prompt to take the 20 MCQs right away
      setActiveView('quiz')
      if (onSubmissionComplete) onSubmissionComplete(updated)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to finalize assignment submission.')
    } finally {
      setIsFinalizing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="assign-runner-loading">
        <div className="quiz-spinner" />
        <p>Opening Interactive Excalidraw Assignment Studio...</p>
      </div>
    )
  }

  // If student switched into the 20-MCQ view
  if (activeView === 'quiz') {
    return (
      <MCQQuizRunner
        assignmentId={assignmentId}
        assignmentTitle={assignment?.title}
        onBack={() => setActiveView('whiteboard')}
        onQuizCompleted={() => {
          loadAssignmentAndSubmission()
          setActiveView('whiteboard')
        }}
      />
    )
  }

  const isSubmitted = submission?.status === 'SUBMITTED' || submission?.status === 'GRADED'
  const isGraded = submission?.status === 'GRADED'

  return (
    <div className="assign-runner-container">
      {/* Top Application Bar */}
      <header className="assign-runner-header">
        <div className="runner-nav-left">
          <button className="runner-back-btn" onClick={onBack}>
            <IconArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="runner-title-info">
            <span className="runner-subject-tag">{assignment?.subject || 'Assignment'}</span>
            <h2>{assignment?.title}</h2>
          </div>
        </div>

        {/* Proctoring & Status Indicators */}
        <div className="runner-nav-right">
          <div className={`proctor-indicator ${tabSwitches > 0 ? 'warn' : 'clean'}`}>
            <IconShield size={16} color={tabSwitches > 0 ? '#F59E0B' : '#10B981'} />
            <span>
              {tabSwitches === 0 ? 'Proctoring Clean (0 Tab Switches)' : `Proctoring Alert: ${tabSwitches} Tab Switch${tabSwitches > 1 ? 'es' : ''}`}
            </span>
          </div>

          {/* Action Trigger for 20-MCQ */}
          <button
            className="btn-launch-mcq"
            onClick={() => setActiveView('quiz')}
          >
            <IconBrain size={16} />
            <span>20-MCQ Verification Assessment</span>
          </button>
        </div>
      </header>

      {/* Floating Proctoring Alert Toast */}
      {showProctorWarning && (
        <div className="proctor-floating-alert">
          <IconAlertTriangle size={20} color="#EF4444" />
          <div>
            <strong>Tab Switch Logged!</strong>
            <p>Navigating away from this exam session is audited and reported to your faculty.</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="runner-alert alert-error">
          <IconAlertTriangle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="runner-alert alert-success">
          <IconCheck size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Faculty Grading Banner if already evaluated */}
      {isGraded && (
        <div className="runner-graded-banner">
          <div className="graded-icon-box">
            <IconAward size={28} color="#10B981" />
          </div>
          <div className="graded-content">
            <h4>Assessment Graded by Faculty</h4>
            <div className="graded-breakdown">
              <span>MCQ Verification: <strong>{submission.mcqScore ?? '—'} / 20</strong></span>
              <span className="dot-divider">•</span>
              <span>Canvas Drawing: <strong>{submission.drawingScore ?? '—'} / 10</strong></span>
              <span className="dot-divider">•</span>
              <span>Total Grade: <strong className="highlight-grade">{(Number(submission.mcqScore || 0) + Number(submission.drawingScore || 0)).toFixed(1)} / 30</strong></span>
            </div>
            {submission.teacherFeedback && (
              <p className="graded-feedback">
                <strong>Teacher Feedback:</strong> "{submission.teacherFeedback}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Workspace: Left Problem Description, Center Excalidraw Whiteboard, Right Notes */}
      <div className="runner-body">
        {/* Left Column: Problem Brief */}
        <aside className="runner-brief-panel">
          <div className="brief-card">
            <h3>Problem Statement</h3>
            <p className="brief-desc">{assignment?.description || 'No additional prompt provided.'}</p>

            <div className="brief-meta-items">
              <div className="brief-meta-row">
                <span className="label">Classroom:</span>
                <span className="val">{assignment?.classroomName || 'Classroom'}</span>
              </div>
              <div className="brief-meta-row">
                <span className="label">Deadline:</span>
                <span className="val">{assignment?.deadline ? new Date(assignment.deadline).toLocaleString() : 'Open'}</span>
              </div>
              <div className="brief-meta-row">
                <span className="label">Evaluation Matrix:</span>
                <span className="val">20 MCQs (20 pts) + Whiteboard (10 pts)</span>
              </div>
              <div className="brief-meta-row">
                <span className="label">Whiteboard Engine:</span>
                <span className="val" style={{ color: '#0D9488', fontWeight: 600 }}>Excalidraw Native Suite</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Column: Full-Featured Excalidraw Whiteboard Studio */}
        <main className="runner-canvas-panel">
          {/* Excalidraw Canvas Viewport */}
          <div className="canvas-wrapper">
            <EduWhiteboard
              initialData={initialDrawingData}
              viewModeEnabled={isSubmitted}
              onApiLoaded={setExcalidrawAPI}
              name={`${assignment?.title || 'solution'}-whiteboard`}
            />
          </div>

          {/* Submission Control Strip */}
          <div className="runner-submission-footer">
            <div className="footer-left">
              <span className="status-label">Submission State:</span>
              <span className={`status-pill ${submission?.status?.toLowerCase() || 'pending'}`}>
                {submission?.status || 'NOT SUBMITTED'}
              </span>
            </div>

            <div className="footer-right">
              {!isSubmitted ? (
                <>
                  <button
                    type="button"
                    className="btn-save-draft"
                    onClick={handleSaveDraft}
                    disabled={isSaving || isFinalizing}
                  >
                    {isSaving ? 'Saving Draft...' : 'Save Excalidraw Draft'}
                  </button>
                  <button
                    type="button"
                    className="btn-finalize"
                    onClick={handleFinalize}
                    disabled={isSaving || isFinalizing}
                  >
                    {isFinalizing ? 'Finalizing...' : (
                      <>
                        <IconCheck size={16} /> Submit & Take 20-MCQ Assessment
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="submitted-msg">
                  <IconCheck size={16} color="#10B981" />
                  <span>Whiteboard submitted. Ensure your 20 MCQs are completed.</span>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Column: Typed Explanation & Notes */}
        <aside className="runner-notes-panel">
          <div className="notes-card">
            <div className="notes-header">
              <IconFileText size={16} color="#0D9488" />
              <h4>Written Solution / Formulas</h4>
            </div>
            <p className="notes-hint">
              Optionally type mathematical steps, code snippets, or rationale to accompany your whiteboard diagram:
            </p>
            <textarea
              className="notes-textarea"
              placeholder="Type your explanation or methodology here..."
              value={writtenNotes}
              onChange={(e) => setWrittenNotes(e.target.value)}
              disabled={isSubmitted}
              rows={16}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}