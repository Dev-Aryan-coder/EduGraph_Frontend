import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import teacherService from '../../services/teacherService'
import AssignmentCreator from './AssignmentCreator'
import AssignmentDetail from './AssignmentDetail'
import EvaluationModal from './EvaluationModal'
import ExtendDeadlineModal from './ExtendDeadlineModal'
import InstitutionalCalendar from '../shared/InstitutionalCalendar'
import NewsResearchFeed from '../shared/NewsResearchFeed'
import ProfileSettings from '../shared/ProfileSettings'
import NoticeBoard from '../shared/NoticeBoard'
import logoSvg from '../../assets/edugraph-logo.svg'
import {
  IconLayoutDashboard,
  IconGraduation,
  IconUser,
  IconInstitution,
  IconLogOut,
  IconArrowLeft,
  IconSearch,
  IconPlus,
  IconFileText,
  IconCheck,
  IconX,
  IconClock,
  IconShield,
  IconBrain,
  IconBolt,
  IconTrash,
  IconBell,
  IconCalendar,
  IconWrench
} from '../../components/common/Icons'
import './TeacherDashboard.css'


export default function TeacherDashboard({ onNavigate, initialTab }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getStoredUser())
  const [activeTab, setActiveTab] = useState(initialTab || 'overview') // 'overview' | 'assignments' | 'grading' | 'feeds' | 'tickets' | 'calendar' | 'news' | 'profile' | 'notices'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  // Real Database State
  const [classrooms, setClassrooms] = useState([])
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [tickets, setTickets] = useState([])
  const [newsList, setNewsList] = useState([])
  const [researchList, setResearchList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Sub-view Routing inside Teacher Workspace
  const [viewingAssignmentId, setViewingAssignmentId] = useState(null)
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false)
  const [prefilledClassroomId, setPrefilledClassroomId] = useState('')

  // Modals & Drawers
  const [selectedClassroomForRoster, setSelectedClassroomForRoster] = useState(null)
  const [rosterStudents, setRosterStudents] = useState([])
  const [isLoadingRoster, setIsLoadingRoster] = useState(false)

  const [selectedSubmissionForEval, setSelectedSubmissionForEval] = useState(null)
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false)

  const [selectedAssignmentForExtend, setSelectedAssignmentForExtend] = useState(null)
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)

  // New Ticket State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [ticketType, setTicketType] = useState('DATA_CORRECTION') // 'DATA_CORRECTION' | 'PERMISSION_OVERRIDE'
  const [ticketTitle, setTicketTitle] = useState('')
  const [ticketDescription, setTicketDescription] = useState('')
  const [ticketClassroomId, setTicketClassroomId] = useState('')
  const [isTicketSubmitting, setIsTicketSubmitting] = useState(false)
  const [ticketError, setTicketError] = useState('')
  const [ticketSuccess, setTicketSuccess] = useState('')

  // Search & Filter State
  const [assignmentSearch, setAssignmentSearch] = useState('')
  const [gradingSearch, setGradingSearch] = useState('')
  const [gradingClassFilter, setGradingClassFilter] = useState('ALL')
  const [gradingStatusFilter, setGradingStatusFilter] = useState('ALL')

  // Toast State
  const [toastMessage, setToastMessage] = useState(null)
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }

  // Load all teacher workspace data
  const loadTeacherData = async () => {
    setIsLoading(true)
    try {
      const [myClasses, myAuthored, myTickets, newsData, researchData] = await Promise.all([
        teacherService.getMyClassrooms(),
        teacherService.getMyAuthoredAssignments(),
        teacherService.getMyTickets(),
        teacherService.getNews(),
        teacherService.getResearchDocs()
      ])

      if (myClasses) setClassrooms(myClasses)
      if (myAuthored) setAssignments(myAuthored)
      if (myTickets) setTickets(myTickets)
      if (newsData) setNewsList(newsData)
      if (researchData) setResearchList(researchData)

      // Fetch all submissions across teacher's assignments
      if (myAuthored && myAuthored.length > 0) {
        const subPromises = myAuthored.map((a) =>
          teacherService.getSubmissionsForAssignment(a.id).catch(() => [])
        )
        const subArrays = await Promise.all(subPromises)
        const allSubs = subArrays.flat()
        setSubmissions(allSubs)
      } else {
        setSubmissions([])
      }
    } catch (err) {
      console.error('Error fetching teacher data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Role Guard: ensure user is TEACHER
  useEffect(() => {
    const role = (currentUser?.role || '').toUpperCase()
    if (role === 'COORDINATOR' || role === 'ROLE_COORDINATOR') {
      if (onNavigate) onNavigate('coordinator')
      else window.location.hash = '#coordinator'
    } else if (role === 'PRINCIPAL' || role === 'ROLE_PRINCIPAL') {
      if (onNavigate) onNavigate('dashboard')
      else window.location.hash = '#dashboard'
    } else if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
      if (onNavigate) onNavigate('admin')
      else window.location.hash = '#admin'
    } else if (role === 'STUDENT' || role === 'ROLE_STUDENT') {
      if (onNavigate) onNavigate('student')
      else window.location.hash = '#student'
    }
  }, [currentUser, onNavigate])

  useEffect(() => {
    const role = (currentUser?.role || '').toUpperCase()
    if (role === 'TEACHER' || role === 'ROLE_TEACHER') {
      loadTeacherData()
    }
  }, [currentUser])

  const handleNavHome = () => {
    if (onNavigate) onNavigate('home')
    else window.location.hash = '#home'
  }

  const handleLogout = async () => {
    await authService.logout()
    handleNavHome()
  }

  // View Class Roster
  const handleOpenClassRoster = async (classroom) => {
    setSelectedClassroomForRoster(classroom)
    setIsLoadingRoster(true)
    try {
      const students = await teacherService.getClassroomStudents(classroom.id)
      setRosterStudents(students)
    } catch (err) {
      console.error('Error loading roster:', err)
      setRosterStudents([])
    } finally {
      setIsLoadingRoster(false)
    }
  }

  // Handle New Ticket Submission
  const handleCreateTicket = async (e) => {
    e.preventDefault()
    setTicketError('')
    setTicketSuccess('')

    if (!ticketTitle.trim() || !ticketDescription.trim()) {
      setTicketError('Ticket Title and detailed description are required.')
      return
    }

    setIsTicketSubmitting(true)
    try {
      await teacherService.createTicket({
        title: ticketTitle.trim(),
        description: ticketDescription.trim(),
        category: ticketType,
        classroomId: ticketClassroomId ? Number(ticketClassroomId) : null
      })

      setTicketSuccess('Support ticket lodged! Routed to College Coordinator & Admin queue.')
      setTicketTitle('')
      setTicketDescription('')
      setTicketClassroomId('')
      await loadTeacherData()

      setTimeout(() => {
        setIsTicketModalOpen(false)
        setTicketSuccess('')
      }, 1500)
    } catch (err) {
      setTicketError(err.response?.data?.message || err.message || 'Failed to submit ticket.')
    } finally {
      setIsTicketSubmitting(false)
    }
  }

  const collegeName = currentUser?.collegeName || 'EduGraph Institution'

  // Navigation Items
  const sidenavItems = [
    { id: 'overview', label: 'Department Overview', icon: <IconLayoutDashboard size={18} /> },
    { id: 'assignments', label: 'Assignments Studio', icon: <IconFileText size={18} /> },
    { id: 'grading', label: 'Grading & Proctoring Roster', icon: <IconGraduation size={18} /> },
  ]

  // Shared Institutional Items
  const sharedNavItems = [
    { id: 'notices', label: 'Notice Board', icon: <IconBell size={18} />, type: 'tab' },
    { id: 'calendar', label: 'Academic Calendar', icon: <IconCalendar size={18} />, type: 'tab' },
    { id: 'feeds', label: 'News & Research Feed', icon: <IconBrain size={18} />, type: 'tab' },
    { id: 'tickets', label: 'Help Desk & Support', icon: <IconWrench size={18} />, type: 'tab' },
    { id: 'profile', label: 'Profile & Settings', icon: <IconUser size={18} />, type: 'tab' },
  ]


  // Filtered Assignments
  const filteredAssignments = assignments.filter((a) => {
    const q = assignmentSearch.toLowerCase()
    const titleMatch = a.title && a.title.toLowerCase().includes(q)
    const subjMatch = a.subject && a.subject.toLowerCase().includes(q)
    return titleMatch || subjMatch
  })

  // Filtered Submissions for Grading
  const filteredSubmissions = submissions.filter((s) => {
    const q = gradingSearch.toLowerCase()
    const nameMatch = s.studentName && s.studentName.toLowerCase().includes(q)
    const rollMatch = s.studentRollNumber && s.studentRollNumber.toLowerCase().includes(q)
    const assignMatch = s.assignmentTitle && s.assignmentTitle.toLowerCase().includes(q)
    const matchesSearch = nameMatch || rollMatch || assignMatch

    const matchesClass =
      gradingClassFilter === 'ALL' || String(s.classroomId) === gradingClassFilter
    const matchesStatus =
      gradingStatusFilter === 'ALL' || s.status === gradingStatusFilter

    return matchesSearch && matchesClass && matchesStatus
  })

  // Submissions Awaiting Grading
  const pendingSubmissions = submissions.filter((s) => s.status === 'SUBMITTED')

  return (
    <div className="teacher-workspace">
      {/* Top Header */}
      <header className="teacher-topbar">
        <div className="topbar-left">
          <img
            src={logoSvg}
            alt="EduGraph Logo"
            className="teacher-brand-logo"
            onClick={handleNavHome}
          />
          <span className="topbar-crumb-sep">/</span>
          <div className="topbar-faculty-badge">
            <IconInstitution size={16} color="#1B7F72" />
            <span className="teacher-college-title">{collegeName}</span>
            <span className="teacher-role-pill">FACULTY INSTRUCTOR WORKSPACE</span>
          </div>
        </div>

        <div className="topbar-right">
          <div
            className="teacher-user-meta"
            onClick={() => setActiveTab('profile')}
            style={{ cursor: 'pointer' }}
            title="Open Profile & Settings"
          >
            <div className="teacher-avatar">
              {(currentUser?.fullName || 'T')[0].toUpperCase()}
            </div>
            <div className="teacher-user-info">
              <span className="user-name">Prof. {currentUser?.fullName || 'Faculty Instructor'}</span>
              <span className="user-email">{currentUser?.email}</span>
            </div>
          </div>

          <button
            type="button"
            className="topbar-btn-logout"
            onClick={handleLogout}
            title="Sign out of teacher workspace"
          >
            <IconLogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="teacher-layout-body">
        {/* Sidenav */}
        <aside className="teacher-sidenav">
          <div className="sidenav-section-title">Instructor Studio</div>
          <nav className="sidenav-nav">
            {sidenavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`sidenav-tab-btn ${activeTab === item.id && !viewingAssignmentId && !isCreatingAssignment ? 'active' : ''}`}
                onClick={() => {
                  setViewingAssignmentId(null)
                  setIsCreatingAssignment(false)
                  setActiveTab(item.id)
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.id === 'grading' && pendingSubmissions.length > 0 && (
                  <span className="nav-badge-pending">{pendingSubmissions.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="sidenav-section-title" style={{ marginTop: '20px' }}>Campus & Institution</div>
          <nav className="sidenav-nav">
            {sharedNavItems.map((item) => {
              const isTabActive = (activeTab === item.id || (item.id === 'feeds' && activeTab === 'news')) && !viewingAssignmentId && !isCreatingAssignment
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidenav-tab-btn ${isTabActive ? 'active' : ''}`}
                  onClick={() => {
                    setViewingAssignmentId(null)
                    setIsCreatingAssignment(false)
                    setActiveTab(item.id)
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              )
            })}
          </nav>


          <div className="sidenav-footer">
            <div className="sidenav-stat-card">
              <span className="card-label">Assigned Sections</span>
              <span className="card-val">{classrooms.length}</span>
              <span className="card-sub">{classrooms.map(c => c.name).join(', ') || 'No Classes'}</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="teacher-main-content">
          {/* Sub-view: Assignment Creator */}
          {isCreatingAssignment ? (
            <AssignmentCreator
              classrooms={classrooms}
              prefilledClassroomId={prefilledClassroomId}
              onCancel={() => setIsCreatingAssignment(false)}
              onAssignmentCreated={async (newAssign) => {
                showToast(`Assignment "${newAssign.title}" published successfully with 20 MCQs!`)
                setIsCreatingAssignment(false)
                await loadTeacherData()
                setActiveTab('assignments')
              }}
            />
          ) : viewingAssignmentId ? (
            /* Sub-view: Assignment Detail */
            <AssignmentDetail
              assignmentId={viewingAssignmentId}
              onBack={() => setViewingAssignmentId(null)}
              onAssignmentDeleted={async () => {
                showToast('Assignment removed successfully')
                setViewingAssignmentId(null)
                await loadTeacherData()
              }}
            />
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="module-container">
                  <div className="module-header-row">
                    <div>
                      <h1 className="module-title">Faculty Coursework & Department Overview</h1>
                      <p className="module-sub">
                        Active course divisions, whiteboard submissions awaiting grading, and classroom rosters.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn-create-assign-cta"
                      onClick={() => setIsCreatingAssignment(true)}
                    >
                      <IconPlus size={16} />
                      <span>Create New Assignment</span>
                    </button>
                  </div>

                  {/* High-level Metric Counters */}
                  <div className="overview-metrics-grid">
                    <div className="metric-card">
                      <div className="m-icon-box teal">
                        <IconGraduation size={22} color="#1B7F72" />
                      </div>
                      <div className="m-info">
                        <span className="m-count">{classrooms.length}</span>
                        <span className="m-title">Assigned Classrooms</span>
                        <span className="m-sub">Divisions under your supervision</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="m-icon-box blue">
                        <IconFileText size={22} color="#2563EB" />
                      </div>
                      <div className="m-info">
                        <span className="m-count">{assignments.length}</span>
                        <span className="m-title">Authored Assignments</span>
                        <span className="m-sub">Each with 20 verification MCQs</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="m-icon-box amber">
                        <IconClock size={22} color="#D97706" />
                      </div>
                      <div className="m-info">
                        <span className="m-count">{pendingSubmissions.length}</span>
                        <span className="m-title">Awaiting Evaluation</span>
                        <span className="m-sub">Canvas whiteboard responses</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="m-icon-box green">
                        <IconCheck size={22} color="#16A34A" />
                      </div>
                      <div className="m-info">
                        <span className="m-count">
                          {submissions.filter(s => s.status === 'EVALUATED').length}
                        </span>
                        <span className="m-title">Graded Submissions</span>
                        <span className="m-sub">Marks calculated out of 30</span>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Classrooms Cards */}
                  <div className="section-panel-card">
                    <div className="section-panel-head">
                      <div>
                        <h3 className="section-title">My Assigned Classroom Divisions</h3>
                        <p className="section-sub">
                          Classrooms allocated to your profile by the College Academic Coordinator.
                        </p>
                      </div>
                      <span className="section-count-tag">{classrooms.length} Active Classrooms</span>
                    </div>

                    {classrooms.length > 0 ? (
                      <div className="classrooms-cards-grid">
                        {classrooms.map((c) => (
                          <div key={c.id} className="faculty-classroom-card">
                            <div className="fc-card-top">
                              <div className="fc-icon-wrap">
                                <IconGraduation size={22} color="#1B7F72" />
                              </div>
                              <div>
                                <h4 className="fc-title">{c.name}</h4>
                                <span className="fc-sec-pill">{c.section ? `Section: ${c.section}` : 'General Division'}</span>
                              </div>
                            </div>

                            <div className="fc-meta-bar">
                              <div className="fc-meta-stat">
                                <span className="stat-num">{c.studentCount || 0}</span>
                                <span className="stat-lbl">Enrolled Students</span>
                              </div>
                              <div className="fc-meta-stat">
                                <span className="stat-num">
                                  {assignments.filter(a => a.classroomId === c.id).length}
                                </span>
                                <span className="stat-lbl">Assignments</span>
                              </div>
                            </div>

                            <div className="fc-actions">
                              <button
                                type="button"
                                className="btn-fc-roster"
                                onClick={() => handleOpenClassRoster(c)}
                              >
                                View Class Roster
                              </button>
                              <button
                                type="button"
                                className="btn-fc-assign"
                                onClick={() => {
                                  setPrefilledClassroomId(String(c.id))
                                  setIsCreatingAssignment(true)
                                }}
                              >
                                + New Assignment
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-classes-notice">
                        <IconGraduation size={32} color="#94A3B8" />
                        <h4>No Classrooms Assigned Yet</h4>
                        <p>
                          Your College Academic Coordinator will allocate classroom sections to your profile from their dashboard.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submissions Awaiting Evaluation Quick Queue */}
                  <div className="section-panel-card">
                    <div className="section-panel-head">
                      <div>
                        <h3 className="section-title">Submissions Requiring Faculty Grading</h3>
                        <p className="section-sub">
                          Real-time queue of student visual whiteboard responses ready for marks entry.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-view-all-queue"
                        onClick={() => setActiveTab('grading')}
                      >
                        View Full Grading Roster ➔
                      </button>
                    </div>

                    {pendingSubmissions.length > 0 ? (
                      <div className="table-responsive">
                        <table className="faculty-table">
                          <thead>
                            <tr>
                              <th>Student Name</th>
                              <th>Roll Number</th>
                              <th>Assignment</th>
                              <th>Submitted At</th>
                              <th>MCQ Score (/20)</th>
                              <th>Proctoring Audit</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingSubmissions.slice(0, 6).map((sub) => {
                              const tabSwitches = sub.tabSwitchCount || 0
                              return (
                                <tr key={sub.id}>
                                  <td className="font-semibold">{sub.studentName}</td>
                                  <td><code>{sub.studentRollNumber || 'N/A'}</code></td>
                                  <td>{sub.assignmentTitle}</td>
                                  <td>{sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Recent'}</td>
                                  <td>
                                    <strong>{sub.mcqScore !== null ? `${sub.mcqScore}/20` : '—'}</strong>
                                  </td>
                                  <td>
                                    {tabSwitches === 0 ? (
                                      <span className="audit-pill clean">✓ Clean (0 Switches)</span>
                                    ) : (
                                      <span className="audit-pill warn">⚠️ {tabSwitches} Switches</span>
                                    )}
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn-eval-cta"
                                      onClick={() => {
                                        setSelectedSubmissionForEval(sub)
                                        setIsEvaluationOpen(true)
                                      }}
                                    >
                                      Grade Canvas ➔
                                    </button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty-classes-notice">
                        <IconCheck size={32} color="#16A34A" />
                        <h4>All Submissions Evaluated!</h4>
                        <p>No student submissions are currently waiting in the grading queue.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ASSIGNMENTS STUDIO */}
              {activeTab === 'assignments' && (
                <div className="module-container">
                  <div className="module-header-row">
                    <div>
                      <h1 className="module-title">Assignment Studio & Coursework Library</h1>
                      <p className="module-sub">
                        Author, monitor deadlines, and inspect whiteboard submissions for your classroom divisions.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn-create-assign-cta"
                      onClick={() => setIsCreatingAssignment(true)}
                    >
                      <IconPlus size={16} />
                      <span>Create New Assignment</span>
                    </button>
                  </div>

                  {/* Search bar */}
                  <div className="faculty-filter-bar">
                    <div className="f-search-box">
                      <IconSearch size={16} color="#64748B" />
                      <input
                        type="text"
                        placeholder="Search assignments by title or subject..."
                        className="f-search-input"
                        value={assignmentSearch}
                        onChange={(e) => setAssignmentSearch(e.target.value)}
                      />
                      {assignmentSearch && (
                        <button
                          type="button"
                          className="f-clear-search"
                          onClick={() => setAssignmentSearch('')}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <span className="f-filter-count">
                      Showing {filteredAssignments.length} of {assignments.length} assignments
                    </span>
                  </div>

                  {/* Assignments Table */}
                  <div className="section-panel-card">
                    {filteredAssignments.length > 0 ? (
                      <div className="table-responsive">
                        <table className="faculty-table">
                          <thead>
                            <tr>
                              <th>Assignment Title</th>
                              <th>Subject / Course</th>
                              <th>Classroom</th>
                              <th>Deadline</th>
                              <th>Submissions</th>
                              <th>MCQ Suite</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAssignments.map((a) => {
                              const dDate = new Date(a.deadline)
                              const isPast = dDate < new Date()
                              const assignSubs = submissions.filter(s => s.assignmentId === a.id)
                              const gradedCount = assignSubs.filter(s => s.status === 'EVALUATED').length

                              return (
                                <tr key={a.id}>
                                  <td>
                                    <strong className="clickable-title" onClick={() => setViewingAssignmentId(a.id)}>
                                      {a.title}
                                    </strong>
                                  </td>
                                  <td>
                                    <span className="subj-badge">{a.subject}</span>
                                  </td>
                                  <td>
                                    <span className="class-badge">
                                      {classrooms.find(c => c.id === a.classroomId)?.name || `Class #${a.classroomId}`}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="deadline-text">
                                      {dDate.toLocaleDateString()} {dDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="subs-badge">
                                      {assignSubs.length} received ({gradedCount} graded)
                                    </span>
                                  </td>
                                  <td>
                                    <span className="mcq-badge">20 Questions</span>
                                  </td>
                                  <td>
                                    {isPast ? (
                                      <span className="status-badge closed">CLOSED</span>
                                    ) : (
                                      <span className="status-badge active">ACTIVE</span>
                                    )}
                                  </td>
                                  <td>
                                    <div className="table-action-btns">
                                      <button
                                        type="button"
                                        className="btn-tbl-action"
                                        onClick={() => setViewingAssignmentId(a.id)}
                                        title="View Submissions and Grading Roster"
                                      >
                                        Submissions
                                      </button>
                                      <button
                                        type="button"
                                        className="btn-tbl-action extend"
                                        onClick={() => {
                                          setSelectedAssignmentForExtend(a)
                                          setIsExtendModalOpen(true)
                                        }}
                                        title="Extend submission deadline by up to 48 hours"
                                      >
                                        +Extend
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty-classes-notice">
                        <IconFileText size={36} color="#94A3B8" />
                        <h4>No Assignments Authored Yet</h4>
                        <p>Create visual whiteboard assignments with 20 verification MCQs for your students.</p>
                        <button
                          type="button"
                          className="btn-create-assign-cta"
                          onClick={() => setIsCreatingAssignment(true)}
                          style={{ marginTop: '12px' }}
                        >
                          + Create First Assignment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: GRADING & PROCTORING ROSTER */}
              {activeTab === 'grading' && (
                <div className="module-container">
                  <div className="module-header-row">
                    <div>
                      <h1 className="module-title">Grading & Proctoring Audit Roster</h1>
                      <p className="module-sub">
                        Dual evaluation studio: Inspect student whiteboard diagrams alongside browser tab-switch event logs.
                      </p>
                    </div>
                  </div>

                  {/* Filters Bar */}
                  <div className="faculty-filter-bar">
                    <div className="f-search-box">
                      <IconSearch size={16} color="#64748B" />
                      <input
                        type="text"
                        placeholder="Search by student name, roll number, or assignment..."
                        className="f-search-input"
                        value={gradingSearch}
                        onChange={(e) => setGradingSearch(e.target.value)}
                      />
                    </div>

                    <select
                      className="f-select-filter"
                      value={gradingClassFilter}
                      onChange={(e) => setGradingClassFilter(e.target.value)}
                    >
                      <option value="ALL">All Classrooms ({classrooms.length})</option>
                      {classrooms.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                          {c.name} {c.section ? `(${c.section})` : ''}
                        </option>
                      ))}
                    </select>

                    <select
                      className="f-select-filter"
                      value={gradingStatusFilter}
                      onChange={(e) => setGradingStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="SUBMITTED">Pending Review ({pendingSubmissions.length})</option>
                      <option value="EVALUATED">Evaluated</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  {/* Submissions Table */}
                  <div className="section-panel-card">
                    {filteredSubmissions.length > 0 ? (
                      <div className="table-responsive">
                        <table className="faculty-table">
                          <thead>
                            <tr>
                              <th>Student Name</th>
                              <th>Roll Number</th>
                              <th>Assignment</th>
                              <th>Submitted At</th>
                              <th>MCQ Score (/20)</th>
                              <th>Drawing Score (/10)</th>
                              <th>Combined Score (/30)</th>
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
                                  <td><code>{sub.studentRollNumber || 'N/A'}</code></td>
                                  <td>{sub.assignmentTitle}</td>
                                  <td>{sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Recent'}</td>
                                  <td>
                                    <strong>{sub.mcqScore !== null ? `${sub.mcqScore}/20` : '—'}</strong>
                                  </td>
                                  <td>
                                    <span>{sub.drawingScore !== null ? `${sub.drawingScore}/10` : 'Pending'}</span>
                                  </td>
                                  <td>
                                    <strong className={isGraded ? 'text-teal font-bold' : ''}>
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
                                    {sub.status === 'EVALUATED' && <span className="status-badge graded">EVALUATED</span>}
                                    {sub.status === 'SUBMITTED' && <span className="status-badge pending">PENDING REVIEW</span>}
                                    {sub.status === 'REJECTED' && <span className="status-badge rejected">REJECTED</span>}
                                    {sub.status === 'IN_PROGRESS' && <span className="status-badge draft">DRAFT</span>}
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn-eval-cta"
                                      onClick={() => {
                                        setSelectedSubmissionForEval(sub)
                                        setIsEvaluationOpen(true)
                                      }}
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
                      <div className="empty-classes-notice">
                        <IconGraduation size={36} color="#94A3B8" />
                        <h4>No Submissions Match Filter</h4>
                        <p>Try resetting the search bar or classroom selector.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: FEEDS & RESEARCH */}
              {activeTab === 'feeds' && (
                <div className="module-container">
                  <div className="module-header-row">
                    <div>
                      <h1 className="module-title">Institutional Feeds & Research Exchange</h1>
                      <p className="module-sub">
                        Access campus broadcast notices and share academic research papers with students.
                      </p>
                    </div>
                  </div>

                  <div className="feeds-grid">
                    {/* Campus Broadcast Notices */}
                    <div className="section-panel-card">
                      <h3 className="section-title">Campus Announcements</h3>
                      <p className="section-sub">Broadcast notices published by college administration.</p>

                      <div className="notices-list">
                        {newsList.length > 0 ? (
                          newsList.map((n) => (
                            <div key={n.id} className="notice-item">
                              <span className="notice-date">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Announcement'}</span>
                              <h4 className="notice-title">{n.title}</h4>
                              <p className="notice-content">{n.content || n.summary}</p>
                            </div>
                          ))
                        ) : (
                          <div className="empty-classes-notice">
                            <p>No active broadcast notices for your campus.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shared Research Papers */}
                    <div className="section-panel-card">
                      <h3 className="section-title">Academic Research Documents</h3>
                      <p className="section-sub">Reference papers and study materials.</p>

                      <div className="research-list">
                        {researchList.length > 0 ? (
                          researchList.map((r) => (
                            <div key={r.id} className="research-item">
                              <div className="r-icon">
                                <IconBrain size={18} color="#1B7F72" />
                              </div>
                              <div className="r-meta">
                                <h4>{r.title}</h4>
                                <p>{r.description || 'Academic research publication'}</p>
                                {r.fileUrl && (
                                  <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="r-link">
                                    View Document ➔
                                  </a>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="empty-classes-notice">
                            <p>No research documents published yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TICKETS & SUPPORT */}
              {activeTab === 'tickets' && (
                <div className="module-container">
                  <div className="module-header-row">
                    <div>
                      <h1 className="module-title">Institutional Ticket Queue & Requests</h1>
                      <p className="module-sub">
                        Submit data correction requests to the Coordinator or permission-override requests to Super Admin.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn-create-assign-cta"
                      onClick={() => setIsTicketModalOpen(true)}
                    >
                      <IconPlus size={16} />
                      <span>Raise Support Ticket</span>
                    </button>
                  </div>

                  <div className="section-panel-card">
                    {tickets.length > 0 ? (
                      <div className="table-responsive">
                        <table className="faculty-table">
                          <thead>
                            <tr>
                              <th>Ticket ID</th>
                              <th>Category</th>
                              <th>Title & Description</th>
                              <th>Classroom</th>
                              <th>Lodged Date</th>
                              <th>Status</th>
                              <th>Resolution Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tickets.map((tk) => (
                              <tr key={tk.id}>
                                <td><code>TICK-{tk.id}</code></td>
                                <td>
                                  <span className={`cat-pill ${tk.category}`}>
                                    {tk.category === 'PERMISSION_OVERRIDE' ? 'Permission Override' : 'Data Correction'}
                                  </span>
                                </td>
                                <td>
                                  <strong>{tk.title}</strong>
                                  <p className="tbl-sub-desc">{tk.description}</p>
                                </td>
                                <td>
                                  {tk.classroomName || (tk.classroomId ? `Class #${tk.classroomId}` : 'General')}
                                </td>
                                <td>{tk.createdAt ? new Date(tk.createdAt).toLocaleDateString() : 'Recent'}</td>
                                <td>
                                  {tk.status === 'RESOLVED' && <span className="status-badge graded">RESOLVED</span>}
                                  {tk.status === 'PENDING' && <span className="status-badge pending">PENDING</span>}
                                  {tk.status === 'REJECTED' && <span className="status-badge rejected">REJECTED</span>}
                                </td>
                                <td>
                                  <span className="res-notes">{tk.resolutionNotes || 'Awaiting staff review'}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty-classes-notice">
                        <IconShield size={36} color="#94A3B8" />
                        <h4>No Support Tickets Lodged</h4>
                        <p>Raise a ticket if you require student roster adjustments or assignment overrides.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: ACADEMIC CALENDAR */}
              {activeTab === 'calendar' && (
                <div className="teacher-embedded-view">
                  <InstitutionalCalendar onBack={() => setActiveTab('overview')} />
                </div>
              )}

              {/* TAB: NEWS & RESEARCH */}
              {(activeTab === 'news' || activeTab === 'feeds') && (
                <div className="teacher-embedded-view">
                  <NewsResearchFeed onBack={() => setActiveTab('overview')} />
                </div>
              )}

              {/* TAB: PROFILE & SETTINGS */}
              {activeTab === 'profile' && (
                <div className="teacher-embedded-view">
                  <ProfileSettings onBack={() => setActiveTab('overview')} />
                </div>
              )}

              {/* TAB: NOTICE BOARD */}
              {activeTab === 'notices' && (
                <div className="teacher-embedded-view">
                  <NoticeBoard onBack={() => setActiveTab('overview')} />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Class Roster Drawer Modal */}
      {selectedClassroomForRoster && (
        <div className="teacher-modal-overlay" onClick={() => setSelectedClassroomForRoster(null)}>
          <div className="teacher-modal-card roster-card" onClick={(e) => e.stopPropagation()}>
            <div className="teacher-modal-head">
              <div>
                <h3 className="teacher-modal-title">Enrolled Students Roster</h3>
                <p className="teacher-modal-sub">
                  Classroom: <strong>{selectedClassroomForRoster.name}</strong> ({selectedClassroomForRoster.section || 'General'})
                </p>
              </div>
              <button
                type="button"
                className="teacher-modal-close"
                onClick={() => setSelectedClassroomForRoster(null)}
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="roster-body">
              {isLoadingRoster ? (
                <div className="roster-loading">
                  <span className="ad-spinner" />
                  <p>Loading classroom roster...</p>
                </div>
              ) : rosterStudents.length > 0 ? (
                <div className="table-responsive">
                  <table className="faculty-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Institutional Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rosterStudents.map((s) => (
                        <tr key={s.id}>
                          <td className="font-semibold">{s.fullName}</td>
                          <td><code>{s.rollNumber || 'PENDING'}</code></td>
                          <td>{s.email}</td>
                          <td>{s.phoneNumber || 'N/A'}</td>
                          <td><span className="status-badge graded">ACTIVE</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-classes-notice">
                  <p>No students enrolled in this classroom section yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Raise Support Ticket Modal */}
      {isTicketModalOpen && (
        <div className="teacher-modal-overlay" onClick={() => setIsTicketModalOpen(false)}>
          <div className="teacher-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="teacher-modal-head">
              <div>
                <h3 className="teacher-modal-title">Raise Institutional Ticket</h3>
                <p className="teacher-modal-sub">
                  Submit student data modifications to the Coordinator or permission overrides to Super Admin.
                </p>
              </div>
              <button
                type="button"
                className="teacher-modal-close"
                onClick={() => setIsTicketModalOpen(false)}
              >
                <IconX size={18} />
              </button>
            </div>

            {ticketError && <div className="ac-alert alert-error"><span>{ticketError}</span></div>}
            {ticketSuccess && <div className="ac-alert alert-success"><span>{ticketSuccess}</span></div>}

            <form onSubmit={handleCreateTicket} className="teacher-modal-form">
              <div className="f-form-group">
                <label className="f-label">Ticket Category *</label>
                <select
                  className="f-input"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                >
                  <option value="DATA_CORRECTION">Data Correction (Routed to Coordinator)</option>
                  <option value="PERMISSION_OVERRIDE">Permission Override (Routed to Admin)</option>
                </select>
              </div>

              <div className="f-form-group">
                <label className="f-label">Associated Classroom (Optional)</label>
                <select
                  className="f-input"
                  value={ticketClassroomId}
                  onChange={(e) => setTicketClassroomId(e.target.value)}
                >
                  <option value="">-- General College Scope --</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name} {c.section ? `(${c.section})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="f-form-group">
                <label className="f-label">Ticket Subject / Title *</label>
                <input
                  type="text"
                  className="f-input"
                  placeholder="e.g. Correction required for student roll number in Division A"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  required
                />
              </div>

              <div className="f-form-group">
                <label className="f-label">Detailed Justification & Request *</label>
                <textarea
                  className="f-input"
                  rows={4}
                  placeholder="Provide precise details of the student or assignment requiring administrative modification..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  required
                />
              </div>

              <div className="teacher-modal-footer">
                <button
                  type="button"
                  className="btn-fc-roster"
                  onClick={() => setIsTicketModalOpen(false)}
                  disabled={isTicketSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-create-assign-cta"
                  disabled={isTicketSubmitting}
                >
                  {isTicketSubmitting ? 'Submitting...' : 'Submit Support Ticket ➔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Evaluation Modal */}
      {isEvaluationOpen && selectedSubmissionForEval && (
        <EvaluationModal
          submission={selectedSubmissionForEval}
          isOpen={isEvaluationOpen}
          onClose={() => {
            setIsEvaluationOpen(false)
            setSelectedSubmissionForEval(null)
          }}
          onGraded={async () => {
            showToast('Evaluation recorded successfully!')
            await loadTeacherData()
          }}
        />
      )}

      {/* Global Extend Deadline Modal */}
      {isExtendModalOpen && selectedAssignmentForExtend && (
        <ExtendDeadlineModal
          assignment={selectedAssignmentForExtend}
          isOpen={isExtendModalOpen}
          onClose={() => {
            setIsExtendModalOpen(false)
            setSelectedAssignmentForExtend(null)
          }}
          onSuccess={async () => {
            showToast('Deadline extended successfully with audit record!')
            await loadTeacherData()
          }}
        />
      )}

      {/* Action Toast */}
      {toastMessage && (
        <div className="coord-toast">
          <IconCheck size={18} color="#22C55E" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}