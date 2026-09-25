import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import studentService from '../../services/studentService'
import sharedService from '../../services/sharedService'
import AssignmentRunner from './AssignmentRunner'
import MCQQuizRunner from './MCQQuizRunner'
import WhiteboardStudio from './WhiteboardStudio'
import ShareNodeModal from './ShareNodeModal'
import logoSvg from '../../assets/edugraph-logo.svg'
import InstitutionalCalendar from '../shared/InstitutionalCalendar'
import NewsResearchFeed from '../shared/NewsResearchFeed'
import ProfileSettings from '../shared/ProfileSettings'
import {
  IconGraduation,
  IconBrain,
  IconShield,
  IconBook,
  IconNodes,
  IconFileText,
  IconCheck,
  IconClock,
  IconAlertTriangle,
  IconPlus,
  IconSearch,
  IconShare,
  IconTrash,
  IconUser,
  IconLogOut,
  IconAward,
  IconCalendar,
  IconBell,
  IconWrench,
  IconX,
  IconArrowLeft,
  IconInstitution
} from '../../components/common/Icons'
import './StudentDashboard.css'

export default function StudentDashboard({ onNavigate, initialTab = 'assignments' }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getStoredUser())
  const [activeTab, setActiveTab] = useState(initialTab || 'assignments') // 'assignments' | 'panels' | 'shared' | 'notices' | 'tickets' | 'calendar' | 'news' | 'profile'

  useEffect(() => {
    if (initialTab && ['assignments', 'panels', 'shared', 'notices', 'tickets', 'calendar', 'news', 'profile'].includes(initialTab)) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  // Real Database State
  const [assignments, setAssignments] = useState([])
  const [panels, setPanels] = useState([])
  const [sharedItems, setSharedItems] = useState([])
  const [notices, setNotices] = useState([])
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'PENDING' | 'SUBMITTED' | 'GRADED'

  // Modals & Sub-Views
  const [activeAssignmentId, setActiveAssignmentId] = useState(null)
  const [activeQuizAssignment, setActiveQuizAssignment] = useState(null)
  const [activePanel, setActivePanel] = useState(null)
  const [isNewPanelModalOpen, setIsNewPanelModalOpen] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState('')
  const [sharingItem, setSharingItem] = useState(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketDescription, setTicketDescription] = useState('')
  const [ticketType, setTicketType] = useState('DATA_CORRECTION')
  const [ticketTargetRole, setTicketTargetRole] = useState('COORDINATOR')
  const [inspectGradeSubmission, setInspectGradeSubmission] = useState(null)

  useEffect(() => {
    loadAllStudentData()
  }, [])

  const loadAllStudentData = async () => {
    setIsLoading(true)
    try {
      const [assigns, userPanels, shared, noticesFeed, myTickets] = await Promise.all([
        studentService.getMyAssignments(),
        studentService.getMyPanels(),
        studentService.getSharedWithMe(),
        sharedService.getMyNotices(),
        sharedService.getMyTickets()
      ])

      setAssignments(assigns || [])
      setPanels(userPanels || [])
      setSharedItems(shared || [])
      setNotices(noticesFeed || [])
      setTickets(myTickets || [])
    } catch (err) {
      console.error('Failed to load student dashboard data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    if (onNavigate) onNavigate('login')
    else window.location.hash = '#login'
  }

  const handleCreatePanel = async (e) => {
    e.preventDefault()
    if (!newSubjectName.trim()) return
    try {
      await studentService.createPanel(newSubjectName.trim())
      setIsNewPanelModalOpen(false)
      setNewSubjectName('')
      const updated = await studentService.getMyPanels()
      setPanels(updated)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create subject panel.')
    }
  }

  const handleDeletePanel = async (panelId) => {
    if (!window.confirm('Are you sure you want to delete this subject panel and its topic nodes?')) return
    try {
      await studentService.deletePanel(panelId)
      const updated = await studentService.getMyPanels()
      setPanels(updated)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete panel.')
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketDescription.trim()) return
    try {
      await sharedService.createTicket({
        subject: ticketSubject.trim(),
        description: ticketDescription.trim(),
        ticketType,
        targetRole: ticketTargetRole
      })
      setIsTicketModalOpen(false)
      setTicketSubject('')
      setTicketDescription('')
      const updated = await sharedService.getMyTickets()
      setTickets(updated)
      alert('Support ticket submitted successfully.')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit ticket.')
    }
  }

  // Active sub-views
  if (activeAssignmentId) {
    return (
      <AssignmentRunner
        assignmentId={activeAssignmentId}
        onBack={() => {
          setActiveAssignmentId(null)
          loadAllStudentData()
        }}
        onSubmissionComplete={() => {
          loadAllStudentData()
        }}
      />
    )
  }

  if (activeQuizAssignment) {
    return (
      <MCQQuizRunner
        assignmentId={activeQuizAssignment.id}
        assignmentTitle={activeQuizAssignment.title}
        onBack={() => {
          setActiveQuizAssignment(null)
          loadAllStudentData()
        }}
        onQuizCompleted={() => {
          loadAllStudentData()
        }}
      />
    )
  }

  if (activePanel) {
    return (
      <WhiteboardStudio
        panelId={activePanel.id}
        panelName={activePanel.subjectName}
        onBack={() => {
          setActivePanel(null)
          loadAllStudentData()
        }}
      />
    )
  }

  // KPI Calculations
  const totalAssignments = assignments.length
  const submittedCount = assignments.filter(a => a.submission?.status === 'SUBMITTED' || a.submission?.status === 'GRADED').length
  const gradedCount = assignments.filter(a => a.submission?.status === 'GRADED').length
  const totalPanels = panels.length

  // Filtered Assignments
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch =
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    const subStatus = a.submission?.status || 'PENDING'
    if (statusFilter === 'ALL') return true
    if (statusFilter === 'PENDING') return subStatus === 'PENDING'
    if (statusFilter === 'SUBMITTED') return subStatus === 'SUBMITTED'
    if (statusFilter === 'GRADED') return subStatus === 'GRADED'
    return true
  })

  const collegeName = currentUser?.collegeName || 'EduGraph Institution'

  return (
    <div className="student-workspace">
      {/* Top Header Bar */}
      <header className="student-topbar">
        <div className="topbar-left">
          <img
            src={logoSvg}
            alt="EduGraph Logo"
            className="student-brand-logo"
            onClick={() => onNavigate ? onNavigate('home') : (window.location.hash = '#home')}
          />
          <span className="topbar-crumb-sep">/</span>
          <div className="topbar-student-badge">
            <IconGraduation size={16} color="#1B7F72" />
            <span className="student-dept-title">{collegeName}</span>
            <span className="student-role-pill">STUDENT LEARNING WORKSPACE</span>
          </div>
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className="topbar-link-btn"
            onClick={() => onNavigate ? onNavigate('home') : (window.location.hash = '#home')}
          >
            <IconArrowLeft size={15} />
            <span>Public Site</span>
          </button>

          <div
            className="topbar-user-badge"
            onClick={() => setActiveTab('profile')}
            style={{ cursor: 'pointer' }}
            title="Open Profile & Settings"
          >
            <div className="student-avatar-circle">
              {currentUser?.profileImageUrl ? (
                <img src={currentUser.profileImageUrl} alt="Student Avatar" className="avatar-img" />
              ) : (
                <span>{(currentUser?.fullName || 'S').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="user-info-text">
              <span className="user-full-name">{currentUser?.fullName || 'Student'}</span>
              <span className="student-roll-tag">
                Roll #{currentUser?.rollNumber || currentUser?.id || '—'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="topbar-icon-logout"
            onClick={handleLogout}
            title="Sign Out"
          >
            <IconLogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="student-body-container">
        {/* Sidenavbar */}
        <aside className="student-sidebar">
          <div className="sidebar-student-card">
            <span className="student-head-label">LEARNING NODE</span>
            <h3 className="student-console-name">
              {currentUser?.classroomName || currentUser?.department || 'Department Classroom'}
            </h3>
            <span className="student-live-status">● Live Academic Session</span>
          </div>

          <div className="sidebar-nav-title">STUDY & COURSEWORK</div>
          <nav className="sidebar-nav-menu">
            <button
              type="button"
              className={`sidebar-nav-link ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              <span className="link-icon"><IconBook size={18} /></span>
              <span className="link-text">My Coursework & Tasks</span>
              <span className="link-badge">{totalAssignments}</span>
              {activeTab === 'assignments' && <span className="active-glow-pill teal-pill" />}
            </button>

            <button
              type="button"
              className={`sidebar-nav-link ${activeTab === 'panels' ? 'active' : ''}`}
              onClick={() => setActiveTab('panels')}
            >
              <span className="link-icon"><IconNodes size={18} /></span>
              <span className="link-text">Subject Whiteboards</span>
              <span className="link-badge">{totalPanels}</span>
              {activeTab === 'panels' && <span className="active-glow-pill teal-pill" />}
            </button>

            <button
              type="button"
              className={`sidebar-nav-link ${activeTab === 'shared' ? 'active' : ''}`}
              onClick={() => setActiveTab('shared')}
            >
              <span className="link-icon"><IconShare size={18} /></span>
              <span className="link-text">Shared With Me</span>
              <span className="link-badge">{sharedItems.length}</span>
              {activeTab === 'shared' && <span className="active-glow-pill teal-pill" />}
            </button>
          </nav>

          <div className="sidebar-nav-title" style={{ marginTop: '20px' }}>CAMPUS & INSTITUTION</div>
          <nav className="sidebar-nav-menu">
            <button
              type="button"
              className={`sidebar-nav-link ${activeTab === 'notices' ? 'active' : ''}`}
              onClick={() => setActiveTab('notices')}
            >
              <span className="link-icon"><IconBell size={18} /></span>
              <span className="link-text">Campus Notices</span>
              {notices.length > 0 && <span className="link-badge">{notices.length}</span>}
              {activeTab === 'notices' && <span className="active-glow-pill teal-pill" />}
            </button>

            <button
              type="button"
              className={`sidebar-nav-link ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <span className="link-icon"><IconWrench size={18} /></span>
              <span className="link-text">Help Desk & Support</span>
              {tickets.length > 0 && <span className="link-badge">{tickets.length}</span>}
              {activeTab === 'tickets' && <span className="active-glow-pill teal-pill" />}
            </button>

            <button
              type="button"
              className={`sidebar-nav-link ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              <span className="link-icon"><IconCalendar size={18} /></span>
              <span className="link-text">Academic Calendar</span>
              {activeTab === 'calendar' && <span className="active-glow-pill teal-pill" />}
            </button>

            <button
              type="button"
              className={`sidebar-nav-link ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              <span className="link-icon"><IconBrain size={18} /></span>
              <span className="link-text">News & Research</span>
              {activeTab === 'news' && <span className="active-glow-pill teal-pill" />}
            </button>

            <button
              type="button"
              className={`sidebar-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="link-icon"><IconUser size={18} /></span>
              <span className="link-text">Profile & Settings</span>
              {activeTab === 'profile' && <span className="active-glow-pill teal-pill" />}
            </button>
          </nav>

          <div className="sidebar-bottom-card">
            <div className="student-shield-icon">
              <IconShield size={16} color="#1B7F72" />
            </div>
            <div className="student-card-text">
              <strong>Tamper-Proof Proctoring Active</strong>
              <span>Zero-Trust focus auditing on exam canvas</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="student-content-area">
          {/* Hero Welcome Banner */}
          <div className="student-hero-banner">
            <div className="student-hero-content">
              <h2>Welcome back, {currentUser?.fullName?.split(' ')[0] || 'Scholar'}!</h2>
              <p>
                Access your active classroom assignments, sketch concept graph nodes, and verify your knowledge with anti-cheat assessments.
              </p>
            </div>

            <div className="student-hero-kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon-box kpi-teal">
                  <IconBook size={20} />
                </div>
                <div className="kpi-meta">
                  <span className="kpi-val">{totalAssignments}</span>
                  <span className="kpi-lbl">Total Tasks</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-box kpi-blue">
                  <IconCheck size={20} />
                </div>
                <div className="kpi-meta">
                  <span className="kpi-val">{submittedCount}</span>
                  <span className="kpi-lbl">Submissions</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-box kpi-green">
                  <IconAward size={20} />
                </div>
                <div className="kpi-meta">
                  <span className="kpi-val">{gradedCount}</span>
                  <span className="kpi-lbl">Evaluated</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-box kpi-purple">
                  <IconNodes size={20} />
                </div>
                <div className="kpi-meta">
                  <span className="kpi-val">{totalPanels}</span>
                  <span className="kpi-lbl">Whiteboards</span>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <div className="student-assignments-view">
              {/* Toolbar: Search & Status Filters */}
              <div className="assign-filter-toolbar">
                <div className="assign-search-box">
                  <IconSearch size={16} />
                  <input
                    type="text"
                    placeholder="Search assignments by title or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="assign-status-pills">
                  {['ALL', 'PENDING', 'SUBMITTED', 'GRADED'].map(st => (
                    <button
                      key={st}
                      className={`status-filter-pill ${statusFilter === st ? 'active' : ''}`}
                      onClick={() => setStatusFilter(st)}
                    >
                      {st === 'ALL' ? 'All Tasks' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignments Grid */}
              {isLoading ? (
                <div className="student-loading">
                  <div className="quiz-spinner" />
                  <p>Loading assignments from your department classroom...</p>
                </div>
              ) : filteredAssignments.length === 0 ? (
                <div className="student-empty-card">
                  <IconBook size={44} color="#94A3B8" />
                  <h3>No Assignments Found</h3>
                  <p>There are no assignments matching your current filter criteria.</p>
                </div>
              ) : (
                <div className="student-assignments-grid">
                  {filteredAssignments.map(a => {
                    const subStatus = a.submission?.status || 'PENDING'
                    const isGraded = subStatus === 'GRADED'
                    const isSubmitted = subStatus === 'SUBMITTED' || isGraded

                    return (
                      <div key={a.id} className="student-assignment-card">
                        <div className="assign-card-head">
                          <span className="assign-subject-badge">{a.subject || 'Core Subject'}</span>
                          <span className={`assign-status-badge badge-${subStatus.toLowerCase()}`}>
                            {subStatus}
                          </span>
                        </div>

                        <h3 className="assign-card-title">{a.title}</h3>
                        <p className="assign-card-desc">
                          {a.description ? `${a.description.slice(0, 110)}...` : 'Complete whiteboard diagram and 20-MCQ verification assessment.'}
                        </p>

                        <div className="assign-card-meta">
                          <div className="meta-item">
                            <IconClock size={14} color="#94A3B8" />
                            <span>Deadline: {a.deadline ? new Date(a.deadline).toLocaleDateString() : 'Open'}</span>
                          </div>
                          <div className="meta-item">
                            <IconBrain size={14} color="#0D9488" />
                            <span>20 Verification MCQs (20 pts)</span>
                          </div>
                        </div>

                        {/* Grade Banner if evaluated */}
                        {isGraded && (
                          <div className="assign-graded-pill" onClick={() => setInspectGradeSubmission(a.submission)}>
                            <IconAward size={16} color="#10B981" />
                            <span>Final Grade: <strong>{(Number(a.submission.mcqScore || 0) + Number(a.submission.drawingScore || 0)).toFixed(1)} / 30</strong></span>
                            <span className="view-feedback-link">View Feedback →</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="assign-card-actions">
                          <button
                            className="btn-open-workspace"
                            onClick={() => setActiveAssignmentId(a.id)}
                          >
                            <IconFileText size={15} />
                            <span>{isSubmitted ? 'View Whiteboard Submission' : 'Open Whiteboard Canvas'}</span>
                          </button>
                          <button
                            className="btn-open-mcq"
                            onClick={() => setActiveQuizAssignment(a)}
                          >
                            <IconBrain size={15} />
                            <span>{a.submission?.mcqScore !== null && a.submission?.mcqScore !== undefined ? 'View Quiz Result' : 'Take 20 MCQs'}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUBJECT WHITEBOARDS */}
          {activeTab === 'panels' && (
            <div className="student-panels-view">
              <div className="panels-view-header">
                <div>
                  <h3>Subject Concept Graphs & Whiteboards</h3>
                  <p>Create visual knowledge graphs and revision sketchboards for your courses</p>
                </div>
                <button
                  className="btn-create-panel"
                  onClick={() => setIsNewPanelModalOpen(true)}
                >
                  <IconPlus size={16} /> New Subject Panel
                </button>
              </div>

              {panels.length === 0 ? (
                <div className="student-empty-card">
                  <IconNodes size={44} color="#0D9488" />
                  <h3>No Subject Panels Created</h3>
                  <p>Create your first subject panel to begin linking topic nodes and drafting study graphs.</p>
                  <button
                    className="btn-create-panel"
                    onClick={() => setIsNewPanelModalOpen(true)}
                  >
                    <IconPlus size={16} /> Create Subject Panel
                  </button>
                </div>
              ) : (
                <div className="student-panels-grid">
                  {panels.map(p => (
                    <div key={p.id} className="student-panel-card">
                      <div className="panel-card-head">
                        <div className="panel-icon-wrap">
                          <IconBook size={20} color="#0D9488" />
                        </div>
                        <div className="panel-head-actions">
                          <button
                            className="btn-icon"
                            title="Share Panel"
                            onClick={() => setSharingItem({ id: p.id, subjectName: p.subjectName, type: 'panel' })}
                          >
                            <IconShare size={15} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            title="Delete Panel"
                            onClick={() => handleDeletePanel(p.id)}
                          >
                            <IconTrash size={15} />
                          </button>
                        </div>
                      </div>

                      <h4 className="panel-subject-title">{p.subjectName}</h4>
                      <p className="panel-meta-desc">
                        Interactive whiteboard concept map with linked prerequisite topics.
                      </p>

                      <button
                        className="btn-enter-studio"
                        onClick={() => setActivePanel(p)}
                      >
                        <IconNodes size={16} /> Open Graph Studio
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SHARED WITH ME */}
          {activeTab === 'shared' && (
            <div className="student-shared-view">
              <div className="panels-view-header">
                <div>
                  <h3>Peer-Shared Concept Nodes & Panels</h3>
                  <p>Study materials and whiteboard diagrams shared with you by classmates (view-only)</p>
                </div>
              </div>

              {sharedItems.length === 0 ? (
                <div className="student-empty-card">
                  <IconShare size={44} color="#94A3B8" />
                  <h3>No Shared Items Yet</h3>
                  <p>When classmates share topic nodes or subject panels with your email, they will appear here.</p>
                </div>
              ) : (
                <div className="student-shared-grid">
                  {sharedItems.map(item => (
                    <div key={item.id} className="student-shared-card">
                      <div className="shared-badge">VIEW-ONLY ACCESS</div>
                      <h4>{item.nodeTitle || item.panelSubjectName || 'Shared Concept'}</h4>
                      <p className="shared-sender">
                        Shared by: <strong>{item.sharedByEmail || 'Classmate'}</strong>
                      </p>
                      {item.nodeContent && (
                        <div className="shared-notes-box">
                          <p>{item.nodeContent}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CAMPUS NOTICES */}
          {activeTab === 'notices' && (
            <div className="student-notices-view">
              <div className="panels-view-header">
                <div>
                  <h3>College Announcements & Notices</h3>
                  <p>Broadcasts from Principal, Academic Coordinators, and Faculty</p>
                </div>
              </div>

              {notices.length === 0 ? (
                <div className="student-empty-card">
                  <IconBell size={44} color="#94A3B8" />
                  <h3>No Active Notices</h3>
                  <p>No college announcements have been posted for your department.</p>
                </div>
              ) : (
                <div className="student-notices-list">
                  {notices.map(n => (
                    <div key={n.id} className="student-notice-item">
                      <div className="notice-icon-box">
                        <IconBell size={18} color="#0D9488" />
                      </div>
                      <div className="notice-content">
                        <div className="notice-meta-top">
                          <span className="notice-badge">{n.priority || 'ANNOUNCEMENT'}</span>
                          <span className="notice-date">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent'}</span>
                        </div>
                        <h4 className="notice-title">{n.title}</h4>
                        <p className="notice-text">{n.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HELP DESK / SUPPORT TICKETS */}
          {activeTab === 'tickets' && (
            <div className="student-tickets-view">
              <div className="panels-view-header">
                <div>
                  <h3>Student Help Desk</h3>
                  <p>Submit data-correction or permission-override requests to Coordinators and Super Admin</p>
                </div>
                <button
                  className="btn-create-panel"
                  onClick={() => setIsTicketModalOpen(true)}
                >
                  <IconPlus size={16} /> Submit New Ticket
                </button>
              </div>

              {tickets.length === 0 ? (
                <div className="student-empty-card">
                  <IconWrench size={44} color="#94A3B8" />
                  <h3>No Support Tickets</h3>
                  <p>Have an issue with classroom allocation or system access? File a ticket here.</p>
                </div>
              ) : (
                <div className="student-tickets-list">
                  {tickets.map(t => (
                    <div key={t.id} className="student-ticket-card">
                      <div className="ticket-card-header">
                        <span className={`ticket-status-pill pill-${t.status?.toLowerCase() || 'open'}`}>
                          {t.status || 'OPEN'}
                        </span>
                        <span className="ticket-target">Assigned to: {t.targetRole}</span>
                      </div>
                      <h4 className="ticket-subject">{t.subject}</h4>
                      <p className="ticket-desc">{t.description}</p>
                      {t.resolutionNotes && (
                        <div className="ticket-resolution-box">
                          <strong>Resolution Note:</strong> {t.resolutionNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: ACADEMIC CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="student-embedded-view">
              <InstitutionalCalendar onBack={() => setActiveTab('assignments')} />
            </div>
          )}

          {/* TAB 7: NEWS & RESEARCH */}
          {activeTab === 'news' && (
            <div className="student-embedded-view">
              <NewsResearchFeed onBack={() => setActiveTab('assignments')} />
            </div>
          )}

          {/* TAB 8: PROFILE & SETTINGS */}
          {activeTab === 'profile' && (
            <div className="student-embedded-view">
              <ProfileSettings onBack={() => setActiveTab('assignments')} />
            </div>
          )}
        </main>
      </div>

      {/* Create Subject Panel Modal */}
      {isNewPanelModalOpen && (
        <div className="modal-backdrop">
          <div className="student-modal-card">
            <div className="modal-header">
              <h3>Create Subject Whiteboard Panel</h3>
              <button className="btn-close" onClick={() => setIsNewPanelModalOpen(false)}>
                <IconX size={18} />
              </button>
            </div>
            <form onSubmit={handleCreatePanel} className="student-modal-form">
              <div className="form-group">
                <label>Subject / Course Name *</label>
                <input
                  type="text"
                  className="student-input"
                  placeholder="e.g. Distributed Operating Systems"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsNewPanelModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <IconPlus size={16} /> Create Subject Panel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Ticket Modal */}
      {isTicketModalOpen && (
        <div className="modal-backdrop">
          <div className="student-modal-card">
            <div className="modal-header">
              <h3>Submit Support Request</h3>
              <button className="btn-close" onClick={() => setIsTicketModalOpen(false)}>
                <IconX size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="student-modal-form">
              <div className="form-group">
                <label>Recipient / Target Authority *</label>
                <select
                  className="student-select"
                  value={ticketTargetRole}
                  onChange={(e) => setTicketTargetRole(e.target.value)}
                >
                  <option value="COORDINATOR">Department Academic Coordinator</option>
                  <option value="ADMIN">Super Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label>Request Category *</label>
                <select
                  className="student-select"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                >
                  <option value="DATA_CORRECTION">Data Correction (Classroom / Roster Issue)</option>
                  <option value="PERMISSION_OVERRIDE">Permission / Access Override</option>
                </select>
              </div>

              <div className="form-group">
                <label>Subject / Title *</label>
                <input
                  type="text"
                  className="student-input"
                  placeholder="e.g. Correction in Roll Number or Missing Subject"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Detailed Explanation *</label>
                <textarea
                  className="student-textarea"
                  placeholder="Describe your issue or change request..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsTicketModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <IconCheck size={16} /> Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Grade Breakdown Modal */}
      {inspectGradeSubmission && (
        <div className="modal-backdrop">
          <div className="grade-modal-card">
            <div className="modal-header">
              <div className="grade-title-wrap">
                <IconAward size={24} color="#10B981" />
                <div>
                  <h3>Assessment Evaluation Breakdown</h3>
                  <p>Certified scores and faculty remarks</p>
                </div>
              </div>
              <button className="btn-close" onClick={() => setInspectGradeSubmission(null)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="grade-modal-body">
              <div className="grade-metric-strip">
                <div className="grade-box">
                  <span className="lbl">20 Verification MCQs</span>
                  <span className="val">{inspectGradeSubmission.mcqScore ?? '—'} <small>/ 20</small></span>
                </div>
                <div className="grade-box">
                  <span className="lbl">Canvas Drawing</span>
                  <span className="val">{inspectGradeSubmission.drawingScore ?? '—'} <small>/ 10</small></span>
                </div>
                <div className="grade-box total">
                  <span className="lbl">Combined Grade</span>
                  <span className="val highlight">
                    {(Number(inspectGradeSubmission.mcqScore || 0) + Number(inspectGradeSubmission.drawingScore || 0)).toFixed(1)}{' '}
                    <small>/ 30</small>
                  </span>
                </div>
              </div>

              {inspectGradeSubmission.teacherFeedback ? (
                <div className="grade-feedback-box">
                  <h4>Faculty Instructor Feedback:</h4>
                  <p>"{inspectGradeSubmission.teacherFeedback}"</p>
                </div>
              ) : (
                <p className="no-feedback-text">No qualitative remarks entered by faculty.</p>
              )}

              <div className="grade-audit-info">
                <IconShield size={16} color="#0D9488" />
                <span>
                  Anti-Cheat Proctoring Record: {inspectGradeSubmission.tabSwitchCount || 0} Tab Switch{inspectGradeSubmission.tabSwitchCount === 1 ? '' : 'es'} Audited.
                </span>
              </div>
            </div>

            <div className="grade-modal-footer">
              <button className="btn-cancel" onClick={() => setInspectGradeSubmission(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareNodeModal
        item={sharingItem}
        isOpen={Boolean(sharingItem)}
        onClose={() => setSharingItem(null)}
        onShared={loadAllStudentData}
      />
    </div>
  )
}