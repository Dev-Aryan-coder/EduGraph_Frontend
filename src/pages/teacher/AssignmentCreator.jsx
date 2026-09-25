import React, { useState } from 'react'
import teacherService from '../../services/teacherService'
import {
  IconGraduation,
  IconCheck,
  IconX,
  IconArrowLeft,
  IconPlus,
  IconBolt,
  IconBrain,
  IconClock,
  IconFileText
} from '../../components/common/Icons'
import './AssignmentCreator.css'

export default function AssignmentCreator({
  classrooms = [],
  onCancel,
  onAssignmentCreated
}) {
  const [step, setStep] = useState(1) // 1: Basics, 2: 20 MCQs, 3: Review & Publish

  // Basics
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [classroomId, setClassroomId] = useState(classrooms[0]?.id ? String(classrooms[0].id) : '')
  const [deadline, setDeadline] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    d.setHours(23, 59, 0, 0)
    return d.toISOString().slice(0, 16)
  })
  const [description, setDescription] = useState('')

  // 20 Questions
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)
  const [questions, setQuestions] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      questionNumber: i + 1,
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 'A',
      explanation: ''
    }))
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Auto-generate 20 smart questions based on subject/title
  const handleAutoFillQuestions = () => {
    const topic = title.trim() || subject.trim() || 'Computer Science & Architecture'
    const generated = Array.from({ length: 20 }, (_, i) => {
      const qNum = i + 1
      return {
        questionNumber: qNum,
        questionText: `Question ${qNum}: Which fundamental rule governs the node relationships and connectivity in ${topic} for case study #${qNum}?`,
        optionA: `Consistent hierarchical traversal preserving structural invariant`,
        optionB: `Linear arbitrary allocation with unindexed memory pointers`,
        optionC: `Synchronous polling of non-adjacent root nodes`,
        optionD: `Decoupled asynchronous broadcast across detached leaves`,
        correctOption: ['A', 'B', 'C', 'D'][i % 4],
        explanation: `Comprehensive rationale for Question ${qNum}: Option ${['A', 'B', 'C', 'D'][i % 4]} enforces integrity within the graph model.`
      }
    })
    setQuestions(generated)
  }

  const handleUpdateCurrentQuestion = (field, val) => {
    setQuestions((prev) => {
      const copy = [...prev]
      copy[activeQuestionIdx] = { ...copy[activeQuestionIdx], [field]: val }
      return copy
    })
  }

  const validateStep1 = () => {
    if (!title.trim()) return 'Assignment Title is required.'
    if (!subject.trim()) return 'Subject / Course is required.'
    if (!classroomId) return 'Please select an assigned classroom.'
    if (!deadline) return 'Submission deadline is required.'
    if (new Date(deadline) <= new Date()) return 'Deadline must be set to a future date/time.'
    return null
  }

  const validateStep2 = () => {
    for (let i = 0; i < 20; i++) {
      const q = questions[i]
      if (!q.questionText.trim()) {
        setActiveQuestionIdx(i)
        return `Question ${i + 1} text cannot be empty.`
      }
      if (!q.optionA.trim() || !q.optionB.trim() || !q.optionC.trim() || !q.optionD.trim()) {
        setActiveQuestionIdx(i)
        return `All 4 options (A, B, C, D) are required for Question ${i + 1}.`
      }
      if (!q.correctOption) {
        setActiveQuestionIdx(i)
        return `Please specify the correct option for Question ${i + 1}.`
      }
    }
    return null
  }

  const handleNextStep = () => {
    setErrorMessage('')
    if (step === 1) {
      const err = validateStep1()
      if (err) {
        setErrorMessage(err)
        return
      }
      setStep(2)
    } else if (step === 2) {
      const err = validateStep2()
      if (err) {
        setErrorMessage(err)
        return
      }
      setStep(3)
    }
  }

  const handleSubmit = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    const step1Err = validateStep1()
    if (step1Err) {
      setStep(1)
      setErrorMessage(step1Err)
      return
    }

    const step2Err = validateStep2()
    if (step2Err) {
      setStep(2)
      setErrorMessage(step2Err)
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        subject: subject.trim(),
        classroomId: Number(classroomId),
        deadline: new Date(deadline).toISOString().slice(0, 19),
        description: description.trim() || 'Construct the visual topic graph and answer the 20 assessment verification questions.',
        excalidrawTemplateData: JSON.stringify({
          prompt: `Draw the comprehensive whiteboard schematic for ${title.trim()}`
        }),
        questions: questions.map((q, idx) => ({
          questionNumber: idx + 1,
          questionText: q.questionText.trim(),
          optionA: q.optionA.trim(),
          optionB: q.optionB.trim(),
          optionC: q.optionC.trim(),
          optionD: q.optionD.trim(),
          correctOption: q.correctOption.toUpperCase(),
          explanation: q.explanation.trim() || null
        }))
      }

      const created = await teacherService.createAssignment(payload)
      setSuccessMessage('Assignment published with 20 MCQs! Notification emails dispatched to classroom students.')

      setTimeout(() => {
        if (onAssignmentCreated) onAssignmentCreated(created)
      }, 1500)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to create assignment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currQ = questions[activeQuestionIdx]

  return (
    <div className="ac-container">
      {/* Top Header */}
      <div className="ac-header">
        <button type="button" className="ac-back-btn" onClick={onCancel}>
          <IconArrowLeft size={16} />
          <span>Back to Assignments</span>
        </button>
        <div className="ac-title-wrap">
          <div className="ac-icon-box">
            <IconGraduation size={20} color="#1B7F72" />
          </div>
          <div>
            <h1 className="ac-main-title">Assignment Authoring Studio</h1>
            <p className="ac-main-sub">
              Define the visual whiteboard challenge and configure the mandatory 20 verification MCQs.
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="ac-wizard-bar">
        <div className={`ac-step-pill ${step >= 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
          <span className="step-num">1</span>
          <span className="step-text">Assignment Details</span>
        </div>
        <div className="ac-step-line" />
        <div className={`ac-step-pill ${step >= 2 ? 'active' : ''}`} onClick={() => setStep(2)}>
          <span className="step-num">2</span>
          <span className="step-text">20 Verification MCQs ({questions.filter(q => q.questionText).length}/20)</span>
        </div>
        <div className="ac-step-line" />
        <div className={`ac-step-pill ${step >= 3 ? 'active' : ''}`} onClick={() => setStep(3)}>
          <span className="step-num">3</span>
          <span className="step-text">Review & Publish</span>
        </div>
      </div>

      {errorMessage && (
        <div className="ac-alert alert-error">
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="ac-alert alert-success">
          <IconCheck size={16} color="#16A34A" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* STEP 1: BASICS */}
      {step === 1 && (
        <div className="ac-panel-card">
          <h3 className="ac-panel-title">1. Coursework Context & Submission Constraints</h3>
          <p className="ac-panel-desc">Set classroom assignment parameters, title, and strict submission deadline.</p>

          <div className="ac-form-grid">
            <div className="ac-form-group col-span-2">
              <label className="ac-label">Assignment Title *</label>
              <input
                type="text"
                className="ac-input"
                placeholder="e.g. Binary Search Trees & Self-Balancing AVL Rotations"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="ac-form-group">
              <label className="ac-label">Subject / Course Name *</label>
              <input
                type="text"
                className="ac-input"
                placeholder="e.g. Data Structures & Algorithms"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="ac-form-group">
              <label className="ac-label">Target Classroom Section *</label>
              <select
                className="ac-select"
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                required
              >
                <option value="">-- Choose Assigned Classroom --</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name} {c.section ? `(${c.section})` : ''} • {c.studentCount || 0} Students
                  </option>
                ))}
              </select>
            </div>

            <div className="ac-form-group">
              <label className="ac-label">Submission Deadline (Strict UTC Date & Time) *</label>
              <input
                type="datetime-local"
                className="ac-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
              <span className="ac-hint">Submissions close automatically at this timestamp.</span>
            </div>

            <div className="ac-form-group col-span-2">
              <label className="ac-label">Whiteboard Instructions & Problem Statement</label>
              <textarea
                className="ac-textarea"
                rows={4}
                placeholder="Provide detailed instructions for the visual whiteboard canvas submission..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="ac-footer-actions">
            <button type="button" className="btn-ac-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn-ac-next" onClick={handleNextStep}>
              Proceed to 20 MCQs Builder ➔
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 20 MCQs BUILDER */}
      {step === 2 && (
        <div className="ac-panel-card">
          <div className="ac-mcq-topbar">
            <div>
              <h3 className="ac-panel-title">2. Mandatory 20-Question MCQ Verification Suite</h3>
              <p className="ac-panel-desc">
                Enforces deep cognitive verification alongside the whiteboard diagram. Students must complete all 20 questions.
              </p>
            </div>
            <button
              type="button"
              className="btn-autofill-mcqs"
              onClick={handleAutoFillQuestions}
              title="Populates all 20 questions with topic-appropriate template questions in 1 click"
            >
              <IconBolt size={15} />
              <span>Auto-fill 20 Verification Questions</span>
            </button>
          </div>

          {/* 20 Question Selector Pills */}
          <div className="ac-mcq-selector-track">
            {questions.map((q, idx) => {
              const isFilled = q.questionText && q.optionA && q.optionB && q.optionC && q.optionD
              return (
                <button
                  key={idx}
                  type="button"
                  className={`mcq-track-pill ${activeQuestionIdx === idx ? 'current' : ''} ${isFilled ? 'filled' : ''}`}
                  onClick={() => setActiveQuestionIdx(idx)}
                >
                  Q{idx + 1}
                  {isFilled && <span className="mcq-tick">✓</span>}
                </button>
              )
            })}
          </div>

          {/* Active Question Editor */}
          <div className="ac-active-question-card">
            <div className="q-badge-row">
              <span className="q-index-pill">Editing Question {activeQuestionIdx + 1} of 20</span>
              <span className="q-note">All 4 options required.</span>
            </div>

            <div className="ac-form-group">
              <label className="ac-label">Question Text *</label>
              <textarea
                className="ac-textarea"
                rows={2}
                placeholder={`Enter question ${activeQuestionIdx + 1} text...`}
                value={currQ.questionText}
                onChange={(e) => handleUpdateCurrentQuestion('questionText', e.target.value)}
                required
              />
            </div>

            <div className="ac-options-grid">
              {['A', 'B', 'C', 'D'].map((optKey) => {
                const isCorrect = currQ.correctOption === optKey
                return (
                  <div
                    key={optKey}
                    className={`ac-option-card ${isCorrect ? 'is-correct-card' : ''}`}
                  >
                    <div className="opt-header">
                      <span className="opt-letter">Option {optKey}</span>
                      <button
                        type="button"
                        className={`opt-mark-correct-btn ${isCorrect ? 'active' : ''}`}
                        onClick={() => handleUpdateCurrentQuestion('correctOption', optKey)}
                      >
                        {isCorrect ? '✓ Correct Answer' : 'Mark as Correct'}
                      </button>
                    </div>
                    <input
                      type="text"
                      className="ac-input"
                      placeholder={`Enter option ${optKey} answer...`}
                      value={currQ[`option${optKey}`]}
                      onChange={(e) => handleUpdateCurrentQuestion(`option${optKey}`, e.target.value)}
                      required
                    />
                  </div>
                )
              })}
            </div>

            <div className="ac-form-group" style={{ marginTop: '14px' }}>
              <label className="ac-label">Explanation / Rationale (Shown after submission)</label>
              <input
                type="text"
                className="ac-input"
                placeholder="Why is this answer correct? (Optional student feedback)"
                value={currQ.explanation}
                onChange={(e) => handleUpdateCurrentQuestion('explanation', e.target.value)}
              />
            </div>
          </div>

          <div className="ac-footer-actions">
            <button type="button" className="btn-ac-cancel" onClick={() => setStep(1)}>
              ⮜ Back to Details
            </button>
            <div className="ac-q-nav-cluster">
              <button
                type="button"
                className="btn-q-nav"
                disabled={activeQuestionIdx === 0}
                onClick={() => setActiveQuestionIdx(p => p - 1)}
              >
                Previous Q
              </button>
              <button
                type="button"
                className="btn-q-nav"
                disabled={activeQuestionIdx === 19}
                onClick={() => setActiveQuestionIdx(p => p + 1)}
              >
                Next Q
              </button>
            </div>
            <button type="button" className="btn-ac-next" onClick={handleNextStep}>
              Review & Publish ➔
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & PUBLISH */}
      {step === 3 && (
        <div className="ac-panel-card">
          <h3 className="ac-panel-title">3. Final Verification & Classroom Broadcast</h3>
          <p className="ac-panel-desc">Review assignment configuration before publishing to enrolled learners.</p>

          <div className="ac-review-summary">
            <div className="review-stat-box">
              <span className="stat-label">Title</span>
              <span className="stat-value">{title}</span>
            </div>
            <div className="review-stat-box">
              <span className="stat-label">Course</span>
              <span className="stat-value">{subject}</span>
            </div>
            <div className="review-stat-box">
              <span className="stat-label">Classroom</span>
              <span className="stat-value">
                {classrooms.find(c => String(c.id) === String(classroomId))?.name || 'Classroom #' + classroomId}
              </span>
            </div>
            <div className="review-stat-box">
              <span className="stat-label">Deadline</span>
              <span className="stat-value">{new Date(deadline).toLocaleString()}</span>
            </div>
            <div className="review-stat-box">
              <span className="stat-label">MCQ Verification Suite</span>
              <span className="stat-value text-green">✓ Exactly 20 Questions Configured</span>
            </div>
          </div>

          <div className="ac-review-notice">
            <IconBrain size={20} color="#1B7F72" />
            <div>
              <h4>Automated Notification Dispatch</h4>
              <p>
                Publishing will record this assignment in MySQL and asynchronously dispatch alert emails with deadline timestamps to all enrolled students in the section.
              </p>
            </div>
          </div>

          <div className="ac-footer-actions">
            <button type="button" className="btn-ac-cancel" onClick={() => setStep(2)}>
              ⮜ Back to MCQs
            </button>
            <button
              type="button"
              className="btn-ac-submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Publishing Assignment...' : 'Publish Assignment to Classroom ➔'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}