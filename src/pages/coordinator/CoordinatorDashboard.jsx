import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import coordinatorService from '../../services/coordinatorService'
import ClassroomManager from './ClassroomManager'
import ExcelImportModal from './ExcelImportModal'
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
  IconMail,
  IconPhone,
  IconShield,
  IconBolt,
  IconInfo
} from '../../components/common/Icons'
import './CoordinatorDashboard.css'

export default function CoordinatorDashboard({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getStoredUser())
  const [activeTab, setActiveTab] = useState('overview')

  // Real Database State
  const [overview, setOverview] = useState(null)
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Search & Filter State
  const [studentSearch, setStudentSearch] = useState('')
  const [studentClassFilter, setStudentClassFilter] = useState('ALL')
  const [teacherSearch, setTeacherSearch] = useState('')

  // Modal State
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false)
  const [excelTargetType, setExcelTargetType] = useState('STUDENT') // 'STUDENT' | 'TEACHER'

  const [isSingleStudentModalOpen, setIsSingleStudentModalOpen] = useState(false)
  const [studName, setStudName] = useState('')
  const [studEmail, setStudEmail] = useState('')
  const [studRoll, setStudRoll] = useState('')
  const [studPhone, setStudPhone] = useState('')
  const [studClassroomId, setStudClassroomId] = useState('')
  const [isStudSubmitting, setIsStudSubmitting] = useState(false)
  const [studError, setStudError] = useState('')
  const [studSuccess, setStudSuccess] = useState('')

  const [isSingleTeacherModalOpen, setIsSingleTeacherModalOpen] = useState(false)
  const [teachName, setTeachName] = useState('')
  const [teachEmail, setTeachEmail] = useState('')
  const [teachPhone, setTeachPhone] = useState('')
  const [isTeachSubmitting, setIsTeachSubmitting] = useState(false)
  const [teachError, setTeachError] = useState('')
  const [teachSuccess, setTeachSuccess] = useState('')

  // Load all real coordinator data from Spring Boot REST endpoints
  const loadCoordinatorData = async () => {
    setIsLoading(true)
    try {
      const [overviewData, studentsData, teachersData, classroomsData] = await Promise.all([
        coordinatorService.getOverview(),
        coordinatorService.getStudents(),
        coordinatorService.getTeachers(),
        coordinatorService.getClassrooms()
      ])

      if (overviewData) setOverview(overviewData)
      if (studentsData) setStudents(studentsData)
      if (teachersData) setTeachers(teachersData)
      if (classroomsData) setClassrooms(classroomsData)
    } catch (err) {
      console.error('Error fetching coordinator data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Role Guard: If logged in as Principal or Admin, route to appropriate workspace
  useEffect(() => {
    const role = (currentUser?.role || '').toUpperCase()
    if (role === 'PRINCIPAL' || role === 'ROLE_PRINCIPAL') {
      if (onNavigate) onNavigate('dashboard')
      else window.location.hash = '#dashboard'
    } else if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
      if (onNavigate) onNavigate('admin')
      else window.location.hash = '#admin'
    }
  }, [currentUser, onNavigate])

  useEffect(() => {
    const role = (currentUser?.role || '').toUpperCase()
    if (role === 'COORDINATOR' || role === 'ROLE_COORDINATOR') {
      loadCoordinatorData()
    }
  }, [currentUser])

  const handleNavHome = () => {
    if (onNavigate) {
      onNavigate('home')
    } else {
      window.location.hash = '#home'
    }
  }

  const handleLogout = async () => {
    await authService.logout()
    handleNavHome()
  }

  // Handle Resend Credentials
  const handleResendCredentials = async (userId, userEmail) => {
    try {
      await coordinatorService.resendCredentials(userId)
      alert(`Credentials refreshed and dispatched to ${userEmail} via SMTP.`)
    } catch (err) {
      alert('Failed to resend credentials: ' + (err.response?.data?.message || err.message))
    }
  }

  // Handle Enroll Single Student
  const handleEnrollStudent = async (e) => {
    e.preventDefault()
    setStudError('')
    setStudSuccess('')

    if (!studName.trim() || !studEmail.trim() || !studRoll.trim()) {
      setStudError('Student Name, Email, and Roll Number are all required.')
      return
    }

    setIsStudSubmitting(true)
    try {
      await coordinatorService.createStudent({
        fullName: studName.trim(),
        email: studEmail.trim(),
        rollNumber: studRoll.trim(),
        phoneNumber: studPhone.trim() || null,
        classroomId: studClassroomId ? Number(studClassroomId) : null
      })

      setStudSuccess(`Student enrolled! Credentials automatically dispatched to ${studEmail.trim()}.`)
      setStudName('')
      setStudEmail('')
      setStudRoll('')
      setStudPhone('')
      setStudClassroomId('')

      await loadCoordinatorData()
      setTimeout(() => {
        setIsSingleStudentModalOpen(false)
        setStudSuccess('')
      }, 1800)
    } catch (err) {
      setStudError(err.response?.data?.message || err.message || 'Failed to enroll student.')
    } finally {
      setIsStudSubmitting(false)
    }
  }

  // Handle Onboard Single Teacher
  const handleOnboardTeacher = async (e) => {
    e.preventDefault()
    setTeachError('')
    setTeachSuccess('')

    if (!teachName.trim() || !teachEmail.trim()) {
      setTeachError('Teacher Name and Email are required.')
      return
    }

    setIsTeachSubmitting(true)
    try {
      await coordinatorService.createTeacher({
        fullName: teachName.trim(),
        email: teachEmail.trim(),
        phoneNumber: teachPhone.trim() || null
      })

      setTeachSuccess(`Teacher onboarded! Credentials automatically dispatched to ${teachEmail.trim()}.`)
      setTeachName('')
      setTeachEmail('')
      setTeachPhone('')

      await loadCoordinatorData()
      setTimeout(() => {
        setIsSingleTeacherModalOpen(false)
        setTeachSuccess('')
      }, 1800)
    } catch (err) {
      setTeachError(err.response?.data?.message || err.message || 'Failed to onboard teacher.')
    } finally {
      setIsTeachSubmitting(false)
    }
  }

  // Sidenav Items
  const sidenavItems = [
    { id: 'overview', label: 'Department Overview', icon: <IconLayoutDashboard size={18} /> },
    { id: 'classrooms', label: 'Classrooms & Sections', icon: <IconGraduation size={18} /> },
    { id: 'students', label: 'Students Roster', icon: <IconUser size={18} /> },
    { id: 'teachers', label: 'Faculty Directory', icon: <IconInstitution size={18} /> },
  ]

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const q = studentSearch.toLowerCase()
    const nameMatch = s.fullName && s.fullName.toLowerCase().includes(q)
    const emailMatch = s.email && s.email.toLowerCase().includes(q)
    const rollMatch = s.rollNumber && s.rollNumber.toLowerCase().includes(q)
    const matchesSearch = nameMatch || emailMatch || rollMatch

    const matchesClass =
      studentClassFilter === 'ALL' ||
      (s.classroom && String(s.classroom.id) === studentClassFilter) ||
      (s.classroomId && String(s.classroomId) === studentClassFilter)

    return matchesSearch && matchesClass
  })

  // Filtered Teachers
  const filteredTeachers = teachers.filter((t) => {
    const q = teacherSearch.toLowerCase()
    const nameMatch = t.fullName && t.fullName.toLowerCase().includes(q)
    const emailMatch = t.email && t.email.toLowerCase().includes(q)
    return nameMatch || emailMatch
  })

  const collegeName = overview?.collegeName || currentUser?.collegeName || 'EduGraph Institution'

  return (
    <div className="coordinator-workspace">
      {/* Top Header Bar */}
      <header className="coordinator-topbar">
        <div className="topbar-left">
          <img
            src={logoSvg}
            alt="EduGraph Logo"
            className="coordinator-brand-logo"
            onClick={handleNavHome}
          />
          <span className="topbar-crumb-sep">/</span>
          <div className="topbar-coord-badge">
            <IconGraduation size={15} color="#1B7F72" />
            <span className="coord-college-title">{collegeName}</span>
            <span className="coord-role-pill">COORDINATOR WORKSPACE</span>
          </div>
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className="topbar-link-btn"
            onClick={handleNavHome}
          >
            <IconArrowLeft size={15} />
            <span>Public Site</span>
          </button>

          <div className="topbar-user-badge">
            <div className="coord-avatar-circle">
              {currentUser?.profileImageUrl ? (
                <img src={currentUser.profileImageUrl} alt="Coordinator Avatar" className="avatar-img" />
              ) : (
                <span>{(currentUser?.fullName || 'C').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="user-info-text">
              <span className="user-full-name">{currentUser?.fullName || 'Academic Coordinator'}</span>
              <span className="coord-email-tag">{currentUser?.email}</span>
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

      {/* Main Body */}
      <div className="coordinator-body-container">
        {/* Sidenav */}
        <aside className="coordinator-sidebar">
          <div className="sidebar-coord-card">
            <span className="coord-head-label">DEPARTMENT NODE</span>
            <h3 className="coord-console-name">{collegeName}</h3>
            <span className="coord-live-status">● Live Database Active</span>
          </div>

          <div className="sidebar-nav-title">COORDINATOR CONTROLS</div>

          <nav className="sidebar-nav-menu">
            {sidenavItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="link-icon">{item.icon}</span>
                  <span className="link-text">{item.label}</span>
                  {isActive && <span className="active-glow-pill teal-pill" />}
                </button>
              )
            })}
          </nav>

          <div className="sidebar-bottom-card">
            <div className="coord-shield-icon">
              <IconShield size={16} color="#1B7F72" />
            </div>
            <div className="coord-card-text">
              <strong>Tamper-Proof Authority</strong>
              <span>Student roll numbers and roster security locked</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="coordinator-content-area">

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Academic Department Overview</h1>
                  <p className="module-sub">
                    Direct live metrics for your college department on the EduGraph platform.
                  </p>
                </div>
              </div>

              {/* Real KPI Cards */}
              <div className="coordinator-kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Enrolled Students</span>
                    <div className="kpi-icon-pill icon-teal">
                      <IconUser size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {overview?.totalStudents ?? students.length}
                  </div>
                  <span className="kpi-sub">Active learners in database</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Faculty Instructors</span>
                    <div className="kpi-icon-pill icon-blue">
                      <IconInstitution size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {overview?.totalTeachers ?? teachers.length}
                  </div>
                  <span className="kpi-sub">Assigned teachers</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Course Classrooms</span>
                    <div className="kpi-icon-pill icon-amber">
                      <IconGraduation size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {overview?.totalClassrooms ?? classrooms.length}
                  </div>
                  <span className="kpi-sub">Academic sections & batches</span>
                </div>
              </div>

              {/* Quick Action Panels */}
              <div className="coord-actions-grid">
                <div
                  className="quick-action-card"
                  onClick={() => {
                    setExcelTargetType('STUDENT')
                    setIsExcelModalOpen(true)
                  }}
                >
                  <div className="qa-icon-box box-teal">
                    <IconFileText size={20} color="#1B7F72" />
                  </div>
                  <h4>Batch Import Students via Excel</h4>
                  <p>Upload a .xlsx or .csv roster to enroll students and dispatch credentials via SMTP.</p>
                  <button type="button" className="qa-action-btn qa-btn-teal">
                    <span>Open Import Tool</span>
                    <span className="qa-arrow">➔</span>
                  </button>
                </div>

                <div
                  className="quick-action-card"
                  onClick={() => {
                    setExcelTargetType('TEACHER')
                    setIsExcelModalOpen(true)
                  }}
                >
                  <div className="qa-icon-box box-blue">
                    <IconInstitution size={20} color="#2563EB" />
                  </div>
                  <h4>Batch Import Faculty via Excel</h4>
                  <p>Upload an instructor spreadsheet to onboard multiple teachers with one click.</p>
                  <button type="button" className="qa-action-btn qa-btn-blue">
                    <span>Open Import Tool</span>
                    <span className="qa-arrow">➔</span>
                  </button>
                </div>

                <div
                  className="quick-action-card"
                  onClick={() => setActiveTab('classrooms')}
                >
                  <div className="qa-icon-box box-amber">
                    <IconGraduation size={20} color="#D97706" />
                  </div>
                  <h4>Manage Classrooms & Sections</h4>
                  <p>Create academic divisions, allocate teaching faculty, and inspect student counts.</p>
                  <button type="button" className="qa-action-btn qa-btn-amber">
                    <span>View Classrooms</span>
                    <span className="qa-arrow">➔</span>
                  </button>
                </div>
              </div>

              {/* Recent Students Panel */}
              <div className="panel-card">
                <div className="panel-card-head">
                  <div>
                    <h3 className="panel-title">Recently Enrolled Students</h3>
                    <p className="panel-sub">Real database records queried from `users` table for this college.</p>
                  </div>
                  <button
                    type="button"
                    className="small-action-btn"
                    onClick={() => setActiveTab('students')}
                  >
                    View Full Roster ➔
                  </button>
                </div>

                {students.length > 0 ? (
                  <div className="table-wrapper">
                    <table className="shadcn-table">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Roll Number</th>
                          <th>Institutional Email</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.slice(0, 6).map((s) => (
                          <tr key={s.id}>
                            <td className="font-semibold">{s.fullName}</td>
                            <td><code>{s.rollNumber || 'N/A'}</code></td>
                            <td>{s.email}</td>
                            <td>
                              <span className="badge-green">● ACTIVE</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state-box">
                    <div className="empty-state-icon">
                      <IconUser size={30} color="#94A3B8" />
                    </div>
                    <h4>No Students Enrolled Yet</h4>
                    <p>Use the Batch Import or Enroll Student tools to add learners.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. CLASSROOMS TAB (Powered by ClassroomManager) */}
          {activeTab === 'classrooms' && (
            <ClassroomManager
              classrooms={classrooms}
              teachers={teachers}
              isLoading={isLoading}
              onRefresh={loadCoordinatorData}
            />
          )}

          {/* 3. STUDENTS ROSTER TAB */}
          {activeTab === 'students' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Student Admissions & Enrollment Roster</h1>
                  <p className="module-sub">
                    Direct access to student profiles, tamper-proof roll numbers, and credential delivery.
                  </p>
                </div>

                <div className="coord-header-actions">
                  <button
                    type="button"
                    className="btn-outline-action"
                    onClick={() => {
                      setExcelTargetType('STUDENT')
                      setIsExcelModalOpen(true)
                    }}
                  >
                    <IconFileText size={15} />
                    <span>Import Excel Roster</span>
                  </button>

                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => setIsSingleStudentModalOpen(true)}
                  >
                    <IconPlus size={15} />
                    <span>Enroll Single Student</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="coord-filters-bar">
                <div className="search-bar-wrap">
                  <IconSearch size={16} color="#64748B" />
                  <input
                    type="text"
                    placeholder="Search by student name, roll number, or email..."
                    className="search-input"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                  {studentSearch && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={() => setStudentSearch('')}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <select
                  className="role-filter-select"
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                >
                  <option value="ALL">All Classrooms ({students.length})</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name} {c.section ? `(${c.section})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Students Table */}
              <div className="panel-card">
                {filteredStudents.length > 0 ? (
                  <div className="table-wrapper">
                    <table className="shadcn-table">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Roll Number</th>
                          <th>Institutional Email</th>
                          <th>Phone</th>
                          <th>Status</th>
                          <th>Credentials</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((s) => (
                          <tr key={s.id}>
                            <td className="font-semibold">{s.fullName}</td>
                            <td>
                              <code className="roll-pill">{s.rollNumber || 'PENDING'}</code>
                            </td>
                            <td>{s.email}</td>
                            <td>{s.phoneNumber || 'N/A'}</td>
                            <td>
                              <span className="badge-green">● ACTIVE</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="resend-cred-btn"
                                onClick={() => handleResendCredentials(s.id, s.email)}
                                title="Dispatch new password to inbox via SMTP"
                              >
                                Resend Email
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : students.length > 0 ? (
                  <div className="empty-state-box">
                    <div className="empty-state-icon">
                      <IconSearch size={30} color="#94A3B8" />
                    </div>
                    <h4>No Students Match Filter</h4>
                    <p>Try resetting the search bar or classroom selection.</p>
                  </div>
                ) : (
                  <div className="empty-state-box">
                    <div className="empty-state-icon">
                      <IconUser size={36} color="#94A3B8" />
                    </div>
                    <h4>No Students Enrolled in Database</h4>
                    <p>
                      Click <strong>Enroll Single Student</strong> or <strong>Import Excel Roster</strong> above to add your first batch of students.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. TEACHERS DIRECTORY TAB */}
          {activeTab === 'teachers' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Faculty & Instructor Directory</h1>
                  <p className="module-sub">
                    Teachers appointed to create visual assignments and grade whiteboard submissions.
                  </p>
                </div>

                <div className="coord-header-actions">
                  <button
                    type="button"
                    className="btn-outline-action"
                    onClick={() => {
                      setExcelTargetType('TEACHER')
                      setIsExcelModalOpen(true)
                    }}
                  >
                    <IconFileText size={15} />
                    <span>Import Faculty Excel</span>
                  </button>

                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => setIsSingleTeacherModalOpen(true)}
                  >
                    <IconPlus size={15} />
                    <span>Onboard Teacher</span>
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="coord-filters-bar">
                <div className="search-bar-wrap">
                  <IconSearch size={16} color="#64748B" />
                  <input
                    type="text"
                    placeholder="Search faculty by name or email..."
                    className="search-input"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Teachers Table */}
              <div className="panel-card">
                {filteredTeachers.length > 0 ? (
                  <div className="table-wrapper">
                    <table className="shadcn-table">
                      <thead>
                        <tr>
                          <th>Faculty Name</th>
                          <th>Institutional Email</th>
                          <th>Phone Number</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Credentials</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTeachers.map((t) => (
                          <tr key={t.id}>
                            <td className="font-semibold">{t.fullName}</td>
                            <td>{t.email}</td>
                            <td>{t.phoneNumber || 'N/A'}</td>
                            <td><span className="tag-teal">TEACHER</span></td>
                            <td><span className="badge-green">● ACTIVE</span></td>
                            <td>
                              <button
                                type="button"
                                className="resend-cred-btn"
                                onClick={() => handleResendCredentials(t.id, t.email)}
                              >
                                Resend Email
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : teachers.length > 0 ? (
                  <div className="empty-state-box">
                    <div className="empty-state-icon">
                      <IconSearch size={30} color="#94A3B8" />
                    </div>
                    <h4>No Faculty Match "{teacherSearch}"</h4>
                    <p>Try searching for a different teacher name or email.</p>
                  </div>
                ) : (
                  <div className="empty-state-box">
                    <div className="empty-state-icon">
                      <IconInstitution size={36} color="#94A3B8" />
                    </div>
                    <h4>No Teachers Onboarded Yet</h4>
                    <p>Onboard instructors so they can design assignments and review whiteboard graphs.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modal 1: Batch Excel Import Modal */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        targetType={excelTargetType}
        classrooms={classrooms}
        onImportSuccess={loadCoordinatorData}
      />

      {/* Modal 2: Enroll Single Student */}
      {isSingleStudentModalOpen && (
        <div className="coord-modal-overlay" onClick={() => setIsSingleStudentModalOpen(false)}>
          <div className="coord-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="coord-modal-head">
              <div>
                <h3 className="coord-modal-title">Enroll Student</h3>
                <p className="coord-modal-sub">
                  Generates database record and dispatches real login credentials to their email via SMTP.
                </p>
              </div>
              <button
                type="button"
                className="coord-modal-close"
                onClick={() => setIsSingleStudentModalOpen(false)}
              >
                <IconX size={18} />
              </button>
            </div>

            {studError && <div className="coord-alert alert-error"><span>{studError}</span></div>}
            {studSuccess && <div className="coord-alert alert-success"><IconCheck size={16} color="#16A34A" /><span>{studSuccess}</span></div>}

            <form onSubmit={handleEnrollStudent} className="coord-modal-form">
              <div className="coord-form-group">
                <label className="coord-label">Full Legal Name *</label>
                <input
                  type="text"
                  className="coord-input"
                  placeholder="e.g. Aryan Pilankar"
                  value={studName}
                  onChange={(e) => setStudName(e.target.value)}
                  required
                />
              </div>

              <div className="coord-form-group">
                <label className="coord-label">Institutional Email *</label>
                <input
                  type="email"
                  className="coord-input"
                  placeholder="e.g. aryan.pilankar@college.edu"
                  value={studEmail}
                  onChange={(e) => setStudEmail(e.target.value)}
                  required
                />
              </div>

              <div className="coord-form-row">
                <div className="coord-form-group">
                  <label className="coord-label">Roll Number *</label>
                  <input
                    type="text"
                    className="coord-input"
                    placeholder="e.g. IT-2026-001"
                    value={studRoll}
                    onChange={(e) => setStudRoll(e.target.value)}
                    required
                  />
                </div>

                <div className="coord-form-group">
                  <label className="coord-label">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    className="coord-input"
                    placeholder="e.g. +91 98123 45678"
                    value={studPhone}
                    onChange={(e) => setStudPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="coord-form-group">
                <label className="coord-label">Assign to Classroom Section</label>
                <select
                  className="coord-select"
                  value={studClassroomId}
                  onChange={(e) => setStudClassroomId(e.target.value)}
                >
                  <option value="">-- General Roster (No Section) --</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.section ? `(${c.section})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="coord-modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsSingleStudentModalOpen(false)}
                  disabled={isStudSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isStudSubmitting}
                >
                  {isStudSubmitting ? 'Enrolling...' : 'Enroll & Dispatch Email ➔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Onboard Single Teacher */}
      {isSingleTeacherModalOpen && (
        <div className="coord-modal-overlay" onClick={() => setIsSingleTeacherModalOpen(false)}>
          <div className="coord-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="coord-modal-head">
              <div>
                <h3 className="coord-modal-title">Onboard Faculty Instructor</h3>
                <p className="coord-modal-sub">
                  Registers teacher and sends login credentials to their email via SMTP.
                </p>
              </div>
              <button
                type="button"
                className="coord-modal-close"
                onClick={() => setIsSingleTeacherModalOpen(false)}
              >
                <IconX size={18} />
              </button>
            </div>

            {teachError && <div className="coord-alert alert-error"><span>{teachError}</span></div>}
            {teachSuccess && <div className="coord-alert alert-success"><IconCheck size={16} color="#16A34A" /><span>{teachSuccess}</span></div>}

            <form onSubmit={handleOnboardTeacher} className="coord-modal-form">
              <div className="coord-form-group">
                <label className="coord-label">Faculty Full Name *</label>
                <input
                  type="text"
                  className="coord-input"
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={teachName}
                  onChange={(e) => setTeachName(e.target.value)}
                  required
                />
              </div>

              <div className="coord-form-group">
                <label className="coord-label">Institutional Email *</label>
                <input
                  type="email"
                  className="coord-input"
                  placeholder="e.g. rajesh.kumar@college.edu"
                  value={teachEmail}
                  onChange={(e) => setTeachEmail(e.target.value)}
                  required
                />
              </div>

              <div className="coord-form-group">
                <label className="coord-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  className="coord-input"
                  placeholder="e.g. +91 98765 43210"
                  value={teachPhone}
                  onChange={(e) => setTeachPhone(e.target.value)}
                />
              </div>

              <div className="coord-modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsSingleTeacherModalOpen(false)}
                  disabled={isTeachSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isTeachSubmitting}
                >
                  {isTeachSubmitting ? 'Onboarding...' : 'Onboard & Dispatch Email ➔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}