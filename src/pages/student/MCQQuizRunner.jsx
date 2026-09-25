import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import studentService from '../../services/studentService'
import {
  IconBrain,
  IconCheck,
  IconArrowLeft,
  IconClock,
  IconShield,
  IconAlertTriangle,
  IconAward
} from '../../components/common/Icons'
import './MCQQuizRunner.css'

export default function MCQQuizRunner({
  assignmentId,
  assignmentTitle,
  onBack,
  onQuizCompleted,
  onAccidentalExit
}) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [quizResult, setQuizResult] = useState(null)
  const [showExitModal, setShowExitModal] = useState(false)

  useEffect(() => {
    loadQuestionsAndExistingResult()
  }, [assignmentId])

  const loadQuestionsAndExistingResult = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      // 1. Check if already attempted
      const result = await studentService.getMyMCQResult(assignmentId)
      if (result && result.score !== undefined && result.score !== null) {
        setQuizResult(result)
      }

      // 2. Load questions
      const qList = await studentService.getMCQQuestions(assignmentId)
      // Sort questions by questionNumber
      qList.sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0))
      setQuestions(qList)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to load assessment questions.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectOption = (questionId, optionKey) => {
    if (quizResult) return // locked if already submitted
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }))
  }

  const answeredCount = Object.keys(selectedAnswers).length
  const totalQuestions = questions.length || 20
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  const handleSubmitAssessment = async () => {
    if (answeredCount < totalQuestions) {
      const confirmIncomplete = window.confirm(
        `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to submit the assessment now?`
      )
      if (!confirmIncomplete) return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      // Format answers payload
      const payload = Object.entries(selectedAnswers).map(([qId, opt]) => ({
        questionId: Number(qId),
        selectedOption: opt
      }))

      const response = await studentService.submitMCQ(assignmentId, payload)
      setQuizResult(response)

      // Celebrate completion
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
      } catch (e) {
        // ignore confetti errors
      }

      if (onQuizCompleted) onQuizCompleted(response)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit MCQ assessment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="quiz-loading-container">
        <div className="quiz-spinner" />
        <p>Loading 20-Question Verification Assessment...</p>
      </div>
    )
  }

  const currentQ = questions[currentIndex]

  const handleBackRequest = () => {
    if (quizResult) {
      onBack()
    } else {
      setShowExitModal(true)
    }
  }

  const handleConfirmExitAndLock = () => {
    setShowExitModal(false)
    if (onAccidentalExit) {
      onAccidentalExit(assignmentId, { id: assignmentId, title: assignmentTitle })
    } else {
      onBack()
    }
  }

  return (
    <div className="quiz-runner-container">
      {/* Top Banner */}
      <header className="quiz-header">
        <div className="quiz-header-left">
          <button className="quiz-back-btn" onClick={handleBackRequest}>
            <IconArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="quiz-meta-title">
            <span className="quiz-badge">20-MCQ Verification Assessment</span>
            <h2>{assignmentTitle || 'Assignment Assessment'}</h2>
          </div>
        </div>

        <div className="quiz-header-right">
          <div className="quiz-proctor-pill">
            <IconShield size={16} color="#0D9488" />
            <span>Anti-Cheat Verification</span>
          </div>
          <div className="quiz-stat-pill">
            <IconBrain size={16} color="#4F46E5" />
            <span>
              <strong>{answeredCount}</strong> / {totalQuestions} Answered
            </span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {errorMessage && (
        <div className="quiz-alert-error">
          <IconAlertTriangle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Already Submitted / Result View */}
      {quizResult ? (
        <div className="quiz-result-card">
          <div className="result-icon-box">
            <IconAward size={48} color="#0D9488" />
          </div>
          <h3>Assessment Completed!</h3>
          <p className="result-sub">
            Your verification assessment has been graded and recorded in the database.
          </p>

          <div className="result-score-strip">
            <div className="score-box">
              <span className="s-label">Total MCQ Score</span>
              <span className="s-value">
                {quizResult.score !== undefined ? quizResult.score : '—'}{' '}
                <small>/ 20</small>
              </span>
            </div>
            <div className="score-box">
              <span className="s-label">Percentage</span>
              <span className="s-value">
                {quizResult.percentage !== undefined
                  ? `${Math.round(quizResult.percentage)}%`
                  : `${Math.round(((quizResult.score || 0) / 20) * 100)}%`}
              </span>
            </div>
            <div className="score-box">
              <span className="s-label">Status</span>
              <span className="s-status-badge badge-pass">VERIFIED & SAVED</span>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn-return-assignment" onClick={onBack}>
              Return to Assignment Workspace
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz Screen */
        <div className="quiz-body-layout">
          {/* Question Navigator Drawer */}
          <aside className="quiz-nav-sidebar">
            <h4>Question Navigator</h4>
            <div className="quiz-nav-grid">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(selectedAnswers[q.id])
                const isCurrent = idx === currentIndex
                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    className={`quiz-q-btn ${isCurrent ? 'current' : ''} ${
                      isAnswered ? 'answered' : ''
                    }`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            <div className="quiz-nav-legend">
              <div className="legend-item">
                <span className="dot dot-answered" /> Answered
              </div>
              <div className="legend-item">
                <span className="dot dot-unanswered" /> Unanswered
              </div>
            </div>
          </aside>

          {/* Active Question Box */}
          <main className="quiz-question-main">
            {currentQ ? (
              <div className="quiz-q-card">
                <div className="quiz-q-meta">
                  <span className="q-number-pill">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  {selectedAnswers[currentQ.id] && (
                    <span className="q-saved-pill">
                      <IconCheck size={14} /> Selected Option {selectedAnswers[currentQ.id]}
                    </span>
                  )}
                </div>

                <h3 className="quiz-q-text">{currentQ.questionText}</h3>

                {/* Options List */}
                <div className="quiz-options-list">
                  {[
                    { key: 'A', text: currentQ.optionA },
                    { key: 'B', text: currentQ.optionB },
                    { key: 'C', text: currentQ.optionC },
                    { key: 'D', text: currentQ.optionD }
                  ].map(opt => {
                    const isSelected = selectedAnswers[currentQ.id] === opt.key
                    return (
                      <div
                        key={opt.key}
                        className={`quiz-opt-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(currentQ.id, opt.key)}
                      >
                        <div className="opt-letter-box">{opt.key}</div>
                        <div className="opt-text-box">{opt.text}</div>
                        {isSelected && (
                          <div className="opt-check-badge">
                            <IconCheck size={16} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Question Footer Controls */}
                <div className="quiz-q-footer">
                  <button
                    type="button"
                    className="quiz-prev-btn"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  >
                    Previous Question
                  </button>

                  <div className="quiz-footer-right">
                    {currentIndex < totalQuestions - 1 ? (
                      <button
                        type="button"
                        className="quiz-next-btn"
                        onClick={() =>
                          setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))
                        }
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="quiz-submit-btn"
                        disabled={isSubmitting}
                        onClick={handleSubmitAssessment}
                      >
                        {isSubmitting ? 'Evaluating...' : 'Submit Assessment (20 MCQs)'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="quiz-empty-q">
                <p>No questions found for this assignment.</p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Accidental Exit Warning Modal */}
      {showExitModal && (
        <div className="modal-backdrop">
          <div className="exit-warning-modal-card">
            <div className="exit-warning-icon">
              <IconAlertTriangle size={36} color="#DC2626" />
            </div>
            <h3 className="exit-warning-title">Warning: Exiting Will Lock This Assessment!</h3>
            <p className="exit-warning-body">
              Your 20-question verification assessment for <strong>{assignmentTitle || 'this assignment'}</strong> is currently in progress ({answeredCount} of {totalQuestions} answered).
            </p>
            <div className="exit-warning-alert-box">
              <strong>🔒 Strict Academic Integrity & Proctoring Rule:</strong>
              <p>
                If you exit now without submitting, this assignment will be <strong>IMMEDIATELY LOCKED</strong>. You will not be permitted to attempt the MCQs or whiteboard again until you submit an unlock ticket to your course teacher and they grant authorization.
              </p>
            </div>
            <div className="exit-warning-actions">
              <button
                type="button"
                className="btn-exit-stay"
                onClick={() => setShowExitModal(false)}
              >
                Continue Assessment
              </button>
              <button
                type="button"
                className="btn-exit-confirm-lock"
                onClick={handleConfirmExitAndLock}
              >
                Exit & Lock Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}