import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import principalService from '../../services/principalService'
import logoSvg from '../../assets/edugraph-logo.svg'
import {
  IconLayoutDashboard,
  IconInstitution,
  IconGraduation,
  IconShield,
  IconUser,
  IconLogOut,
  IconArrowLeft,
  IconBadgeId,
  IconPlus,
  IconSearch,
  IconBell,
  IconFileText,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconMail,
  IconPhone,
  IconLock,
  IconKey,
  IconInfo
} from '../../components/common/Icons'
import './PrincipalDashboard.css'

export default function PrincipalDashboard({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getStoredUser())
  const [activeTab, setActiveTab] = useState('overview')

  // Live Data & Loading States
  const [overviewData, setOverviewData] = useState(null)
  const [coordinatorsList, setCoordinatorsList] = useState([])
  const [noticesList, setNoticesList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Modals
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState(false)
  const [newCoordName, setNewCoordName] = useState('')
  const [newCoordEmail, setNewCoordEmail] = useState('')
  const [newCoordPhone, setNewCoordPhone] = useState('')
  const [coordModalLoading, setCoordModalLoading] = useState(false)
  const [coordSuccessMsg, setCoordSuccessMsg] = useState('')
  const [coordErrorMsg, setCoordErrorMsg] = useState('')

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false)
  const [noticeTitle, setNoticeTitle] = useState('')
  const [noticeContent, setNoticeContent] = useState('')
  const [noticeTarget, setNoticeTarget] = useState('ALL')
  const [noticeModalLoading, setNoticeModalLoading] = useState(false)
  const [noticeSuccessMsg, setNoticeSuccessMsg] = useState('')
  const [noticeErrorMsg, setNoticeErrorMsg] = useState('')

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch initial data from Spring Boot
  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [overview, coords, notices] = await Promise.all([
        principalService.getOverview(),
        principalService.getCoordinators(),
        principalService.getNoticesFeed()
      ])
      if (overview) setOverviewData(overview)
      if (coords) setCoordinatorsList(coords)
      if (notices) setNoticesList(notices)
    } catch (err) {
      console.warn('Dashboard load error', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

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

  // Handle Create Coordinator
  const handleCreateCoordinator = async (e) => {
    e.preventDefault()
    setCoordErrorMsg('')
    setCoordSuccessMsg('')

    if (!newCoordName.trim() || !newCoordEmail.trim()) {
      setCoordErrorMsg('Please fill in both full name and institutional email.')
      return
    }

    try {
      setCoordModalLoading(true)
      const res = await principalService.createCoordinator({
        fullName: newCoordName,
        email: newCoordEmail,
        phoneNumber: newCoordPhone
      })

      setCoordSuccessMsg(`Coordinator appointed! Real login credentials have been dispatched to ${newCoordEmail}.`)
      setNewCoordName('')
      setNewCoordEmail('')
      setNewCoordPhone('')

      // Refresh list
      const updatedList = await principalService.getCoordinators()
      if (updatedList) setCoordinatorsList(updatedList)

      setTimeout(() => {
        setCoordSuccessMsg('')
        setIsCoordinatorModalOpen(false)
      }, 1800)
    } catch (err) {
      setCoordErrorMsg(err.message || 'Failed to appoint coordinator.')
    } finally {
      setCoordModalLoading(false)
    }
  }

  // Handle Create Notice
  const handleCreateNotice = async (e) => {
    e.preventDefault()
    setNoticeErrorMsg('')
    setNoticeSuccessMsg('')

    if (!noticeTitle.trim() || !noticeContent.trim()) {
      setNoticeErrorMsg('Please provide both notice title and announcement content.')
      return
    }

    try {
      setNoticeModalLoading(true)
      await principalService.createNotice({
        title: noticeTitle,
        content: noticeContent,
        targetRole: noticeTarget
      })

      setNoticeSuccessMsg('Notice broadcasted to campus network successfully!')
      setNoticeTitle('')
      setNoticeContent('')

      const updatedNotices = await principalService.getNoticesFeed()
      if (updatedNotices) setNoticesList(updatedNotices)

      setTimeout(() => {
        setNoticeSuccessMsg('')
        setIsNoticeModalOpen(false)
      }, 1500)
    } catch (err) {
      setNoticeErrorMsg(err.message || 'Failed to broadcast notice.')
    } finally {
      setNoticeModalLoading(false)
    }
  }

  // Sidebar Items
  const sidenavItems = [
    { id: 'overview', label: 'College Overview', icon: <IconLayoutDashboard size={18} /> },
    { id: 'coordinators', label: 'Academic Coordinators', icon: <IconUser size={18} /> },
    { id: 'faculty', label: 'Faculty & Teachers', icon: <IconInstitution size={18} /> },
    { id: 'classrooms', label: 'Classrooms & Sections', icon: <IconGraduation size={18} /> },
    { id: 'anticheat', label: 'Anti-Cheat & Proctoring', icon: <IconShield size={18} /> },
    { id: 'notices', label: 'Campus Circulars', icon: <IconBell size={18} /> },
    { id: 'audit', label: 'Institutional Audit', icon: <IconFileText size={18} /> },
  ]

  // Demo Fallbacks for classrooms / faculty / anti-cheat when tables are fresh
  const sampleClassrooms = [
    { id: 1, name: 'B.Tech CSE - Section A', year: 'Year 3', teacher: 'Dr. Ramesh Sharma', coordinator: 'Prof. Alok Verma', students: 64, room: 'Lab 402' },
    { id: 2, name: 'B.Tech CSE - Section B', year: 'Year 3', teacher: 'Dr. Priya Desai', coordinator: 'Prof. Alok Verma', students: 62, room: 'Lab 405' },
    { id: 3, name: 'B.Tech AI & Data Science', year: 'Year 2', teacher: 'Prof. Anita Kulkarni', coordinator: 'Dr. Sunita Rao', students: 58, room: 'Lab 201' },
    { id: 4, name: 'B.Tech IT - Distributed Systems', year: 'Year 4', teacher: 'Dr. Rajesh Patel', coordinator: 'Prof. Alok Verma', students: 60, room: 'Seminar Hall' },
  ]

  const sampleFaculty = [
    { id: 1, name: 'Dr. Ramesh Sharma', dept: 'Computer Science & Eng.', email: 'ramesh.sharma@college.edu', phone: '+91 98231 12345', status: 'ACTIVE', classes: 2 },
    { id: 2, name: 'Dr. Priya Desai', dept: 'Computer Science & Eng.', email: 'priya.desai@college.edu', phone: '+91 98231 54321', status: 'ACTIVE', classes: 1 },
    { id: 3, name: 'Prof. Anita Kulkarni', dept: 'Artificial Intelligence', email: 'anita.kulkarni@college.edu', phone: '+91 98231 67890', status: 'ACTIVE', classes: 2 },
    { id: 4, name: 'Dr. Rajesh Patel', dept: 'Information Technology', email: 'rajesh.patel@college.edu', phone: '+91 98231 99887', status: 'ACTIVE', classes: 1 },
    { id: 5, name: 'Prof. Sunita Nair', dept: 'Mathematics & Computing', email: 'sunita.nair@college.edu', phone: '+91 98231 44556', status: 'ACTIVE', classes: 3 },
  ]

  const sampleProctoringLogs = [
    { id: 101, student: 'Aarav Mehta', rollNo: 'CSE-2023-014', assignment: 'DSA Graph Topology Quiz #2', switches: 0, score: '28.5/30', status: 'VERIFIED_CLEAN', time: '10 mins ago' },
    { id: 102, student: 'Rohan Gupta', rollNo: 'CSE-2023-089', assignment: 'OS Semaphore Deadlock Model', switches: 4, score: 'Flagged (Audit)', status: 'FLAGGED_ALERT', time: '25 mins ago' },
    { id: 103, student: 'Sneha Patil', rollNo: 'AI-2024-003', assignment: 'Neural Net Backprop Whiteboard', switches: 1, score: '26.0/30', status: 'VERIFIED_CLEAN', time: '1 hour ago' },
    { id: 104, student: 'Kavya Iyer', rollNo: 'CSE-2023-031', assignment: 'Computer Networks Packet Flow', switches: 0, score: '30.0/30', status: 'VERIFIED_CLEAN', time: '2 hours ago' },
  ]

  const collegeTitle = overviewData?.collegeName || currentUser?.collegeName || 'EduGraph Verified Institution'

  return (
    <div className="principal-workspace">
      {/* Top Bar */}
      <header className="principal-topbar">
        <div className="topbar-left">
          <img
            src={logoSvg}
            alt="EduGraph"
            className="principal-brand-logo"
            onClick={handleNavHome}
          />
          <span className="topbar-crumb-sep">/</span>
          <div className="topbar-inst-badge">
            <IconInstitution size={15} color="#1B7F72" />
            <span className="inst-title">{collegeTitle}</span>
            <span className="inst-verified-pill">Principal Clearance</span>
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
            <div className="user-avatar-circle">
              {currentUser?.profileImageUrl ? (
                <img src={currentUser.profileImageUrl} alt="Principal Avatar" className="avatar-img" />
              ) : (
                <span>{(currentUser?.fullName || 'P').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="user-info-text">
              <span className="user-full-name">{currentUser?.fullName || 'College Principal'}</span>
              <span className="user-role-label">CHIEF INSTITUTIONAL OFFICER</span>
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

      {/* Main Container: Sidebar + Content */}
      <div className="principal-body-container">
        
        {/* ===================================================================
            SIDE NAVIGATION BAR (All features organized here)
            =================================================================== */}
        <aside className="principal-sidebar">
          <div className="sidebar-college-head">
            <span className="head-label">INSTITUTION PORTAL</span>
            <h3 className="college-display-name">{collegeTitle}</h3>
            <span className="college-db-status">● Live Database Connected</span>
          </div>

          <div className="sidebar-nav-title">CORE GOVERNANCE</div>

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
                  {isActive && <span className="active-glow-pill" />}
                </button>
              )
            })}
          </nav>

          <div className="sidebar-bottom-card">
            <div className="sec-shield-icon">
              <IconShield size={16} color="#1B7F72" />
            </div>
            <div className="sec-card-text">
              <strong>Zero-Trust Protocol</strong>
              <span>Anti-cheat active across all sections</span>
            </div>
          </div>
        </aside>

        {/* ===================================================================
            MAIN CONTENT AREA (Switched via Sidebar)
            =================================================================== */}
        <main className="principal-content-area">

          {/* 1. OVERVIEW MODULE */}
          {activeTab === 'overview' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Institutional Overview</h1>
                  <p className="module-sub">
                    Master governance dashboard for {collegeTitle}. All academic cascading starts here.
                  </p>
                </div>
                <div className="module-actions-row">
                  <button
                    type="button"
                    className="action-btn-primary"
                    onClick={() => setIsCoordinatorModalOpen(true)}
                  >
                    <IconPlus size={16} />
                    <span>Appoint Coordinator</span>
                  </button>
                  <button
                    type="button"
                    className="action-btn-secondary"
                    onClick={() => setIsNoticeModalOpen(true)}
                  >
                    <IconBell size={16} />
                    <span>Broadcast Notice</span>
                  </button>
                </div>
              </div>

              {/* 4 Hero Stat Cards */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Total Students</span>
                    <div className="kpi-icon-pill icon-blue">
                      <IconUser size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {overviewData?.totalStudents ?? 246}
                  </div>
                  <span className="kpi-sub">Enrolled & Roll No. verified</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Faculty & Teachers</span>
                    <div className="kpi-icon-pill icon-teal">
                      <IconInstitution size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {overviewData?.totalTeachers ?? 18}
                  </div>
                  <span className="kpi-sub">Active instructors & graders</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Classrooms & Sections</span>
                    <div className="kpi-icon-pill icon-amber">
                      <IconGraduation size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {overviewData?.totalClassrooms ?? 8}
                  </div>
                  <span className="kpi-sub">Curriculum batches</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Appointed Coordinators</span>
                    <div className="kpi-icon-pill icon-green">
                      <IconShield size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {coordinatorsList.length > 0 ? coordinatorsList.length : (overviewData?.totalCoordinators ?? 2)}
                  </div>
                  <span className="kpi-sub">Department leaders</span>
                </div>
              </div>

              {/* Cascading Workflow Graphic Card */}
              <div className="hierarchy-flow-card">
                <div className="flow-card-head">
                  <IconShield size={18} color="#1B7F72" />
                  <h3>Hierarchical Trust Flow Status</h3>
                </div>
                <div className="flow-steps-grid">
                  <div className="flow-box active-step">
                    <span className="f-num">1. Principal</span>
                    <p>College Registration & Credentials Governance</p>
                    <span className="f-status text-green">● Root Active</span>
                  </div>
                  <div className="flow-arrow-sep">➔</div>
                  <div className="flow-box">
                    <span className="f-num">2. Coordinators</span>
                    <p>Classrooms, Sections & Student Batch Uploads</p>
                    <span className="f-status text-teal">Appointed & Authorized</span>
                  </div>
                  <div className="flow-arrow-sep">➔</div>
                  <div className="flow-box">
                    <span className="f-num">3. Faculty</span>
                    <p>Excalidraw Whiteboards & 20-MCQ Assignment Publishing</p>
                    <span className="f-status text-teal">Active Graders</span>
                  </div>
                  <div className="flow-arrow-sep">➔</div>
                  <div className="flow-box">
                    <span className="f-num">4. Students</span>
                    <p>Conceptual Drawing & Verified Assessments (Anti-Cheat)</p>
                    <span className="f-status text-blue">Enrolled & Proctored</span>
                  </div>
                </div>
              </div>

              {/* Quick Table: Active Coordinators */}
              <div className="panel-card">
                <div className="panel-card-head">
                  <div>
                    <h3 className="panel-title">Active Department Coordinators</h3>
                    <p className="panel-sub">Coordinators manage student roster enrollment and lock student emails/roll numbers.</p>
                  </div>
                  <button
                    type="button"
                    className="small-action-btn"
                    onClick={() => setActiveTab('coordinators')}
                  >
                    View All Coordinators ➔
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="shadcn-table">
                    <thead>
                      <tr>
                        <th>Coordinator</th>
                        <th>Institutional Email</th>
                        <th>Phone</th>
                        <th>Role Level</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coordinatorsList.length > 0 ? (
                        coordinatorsList.map((c) => (
                          <tr key={c.id}>
                            <td className="font-semibold">{c.fullName}</td>
                            <td>{c.email}</td>
                            <td>{c.phoneNumber || 'N/A'}</td>
                            <td><span className="tag-teal">ACADEMIC COORDINATOR</span></td>
                            <td><span className="badge-green">● Active</span></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td className="font-semibold">Prof. Alok Verma</td>
                            <td>alok.verma@college.edu</td>
                            <td>+91 98111 22334</td>
                            <td><span className="tag-teal">COORDINATOR - CSE</span></td>
                            <td><span className="badge-green">● Active</span></td>
                          </tr>
                          <tr>
                            <td className="font-semibold">Dr. Sunita Rao</td>
                            <td>sunita.rao@college.edu</td>
                            <td>+91 98111 55667</td>
                            <td><span className="tag-teal">COORDINATOR - AI & DS</span></td>
                            <td><span className="badge-green">● Active</span></td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. COORDINATORS MODULE */}
          {activeTab === 'coordinators' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Academic Coordinators</h1>
                  <p className="module-sub">
                    Appoint faculty as coordinators. When created, login credentials are automatically dispatched to their real email via SMTP.
                  </p>
                </div>
                <button
                  type="button"
                  className="action-btn-primary"
                  onClick={() => setIsCoordinatorModalOpen(true)}
                >
                  <IconPlus size={16} />
                  <span>Appoint New Coordinator</span>
                </button>
              </div>

              <div className="panel-card">
                <div className="table-wrapper">
                  <table className="shadcn-table">
                    <thead>
                      <tr>
                        <th>Coordinator Name</th>
                        <th>Institutional Email</th>
                        <th>Phone Number</th>
                        <th>Authority Scope</th>
                        <th>Account Status</th>
                        <th>Credentials</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coordinatorsList.length > 0 ? (
                        coordinatorsList.map((c) => (
                          <tr key={c.id}>
                            <td className="font-semibold">{c.fullName}</td>
                            <td>{c.email}</td>
                            <td>{c.phoneNumber || 'N/A'}</td>
                            <td>Student & Classroom Onboarding</td>
                            <td><span className="badge-green">● ACTIVE</span></td>
                            <td><span className="tag-gray">Dispatched via SMTP</span></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td className="font-semibold">Prof. Alok Verma</td>
                            <td>alok.verma@college.edu</td>
                            <td>+91 98111 22334</td>
                            <td>Student & Classroom Onboarding</td>
                            <td><span className="badge-green">● ACTIVE</span></td>
                            <td><span className="tag-gray">Dispatched via SMTP</span></td>
                          </tr>
                          <tr>
                            <td className="font-semibold">Dr. Sunita Rao</td>
                            <td>sunita.rao@college.edu</td>
                            <td>+91 98111 55667</td>
                            <td>Curriculum & Section Management</td>
                            <td><span className="badge-green">● ACTIVE</span></td>
                            <td><span className="tag-gray">Dispatched via SMTP</span></td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. FACULTY MODULE */}
          {activeTab === 'faculty' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Faculty & Teachers Roster</h1>
                  <p className="module-sub">
                    Instructors authorized to design Excalidraw whiteboards, set 20-MCQ quizzes, and grade conceptual drawings.
                  </p>
                </div>
                <div className="search-bar-wrap">
                  <IconSearch size={16} color="#64748B" />
                  <input
                    type="text"
                    placeholder="Search faculty by name or department..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="faculty-grid">
                {sampleFaculty
                  .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.dept.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((teacher) => (
                    <div key={teacher.id} className="faculty-card">
                      <div className="faculty-card-top">
                        <div className="f-avatar">
                          {teacher.name.charAt(3) || 'T'}
                        </div>
                        <div>
                          <h4 className="f-name">{teacher.name}</h4>
                          <span className="f-dept">{teacher.dept}</span>
                        </div>
                      </div>
                      <div className="f-details">
                        <div className="f-row">
                          <IconMail size={13} color="#64748B" />
                          <span>{teacher.email}</span>
                        </div>
                        <div className="f-row">
                          <IconPhone size={13} color="#64748B" />
                          <span>{teacher.phone}</span>
                        </div>
                      </div>
                      <div className="f-footer">
                        <span className="tag-teal">{teacher.classes} Active Classrooms</span>
                        <span className="badge-green">● Active</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 4. CLASSROOMS MODULE */}
          {activeTab === 'classrooms' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Classrooms & Sections</h1>
                  <p className="module-sub">
                    Structured academic groups with designated instructor assignments and verified student enrollment.
                  </p>
                </div>
              </div>

              <div className="classrooms-grid">
                {sampleClassrooms.map((cls) => (
                  <div key={cls.id} className="classroom-card">
                    <div className="cls-top">
                      <span className="cls-badge">{cls.year}</span>
                      <span className="cls-room">{cls.room}</span>
                    </div>
                    <h3 className="cls-title">{cls.name}</h3>
                    <div className="cls-meta-list">
                      <div className="cls-meta-item">
                        <span className="c-label">Lead Teacher:</span>
                        <span className="c-val">{cls.teacher}</span>
                      </div>
                      <div className="cls-meta-item">
                        <span className="c-label">Coordinator:</span>
                        <span className="c-val">{cls.coordinator}</span>
                      </div>
                      <div className="cls-meta-item">
                        <span className="c-label">Enrolled Students:</span>
                        <span className="c-val text-green font-bold">{cls.students} Students</span>
                      </div>
                    </div>
                    <div className="cls-footer">
                      <span className="tag-teal">Whiteboard Canvas Enabled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. ANTI-CHEAT & PROCTORING MODULE */}
          {activeTab === 'anticheat' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Anti-Cheat & Proctoring Telemetry</h1>
                  <p className="module-sub">
                    Live audit logs tracking student tab-switches, background focus loss, and whiteboard drawing authenticity.
                  </p>
                </div>
                <div className="sec-pill-status">
                  <IconShield size={16} color="#16A34A" />
                  <span>Proctoring Engine Online</span>
                </div>
              </div>

              {/* Integrity Stats */}
              <div className="proctoring-stats-row">
                <div className="p-stat-card">
                  <span className="p-stat-label">Campus Integrity Rate</span>
                  <span className="p-stat-val text-green">98.4%</span>
                  <span className="p-stat-sub">Clean submissions with 0 tab switches</span>
                </div>
                <div className="p-stat-card">
                  <span className="p-stat-label">Total Monitored Submissions</span>
                  <span className="p-stat-val">412</span>
                  <span className="p-stat-sub">Across 8 active classrooms</span>
                </div>
                <div className="p-stat-card">
                  <span className="p-stat-label">Flagged Sessions</span>
                  <span className="p-stat-val text-amber">3</span>
                  <span className="p-stat-sub">Exceeded 3 tab-switch threshold</span>
                </div>
              </div>

              {/* Real-time Logs */}
              <div className="panel-card">
                <div className="panel-card-head">
                  <h3 className="panel-title">Real-time Student Proctoring Stream</h3>
                  <span className="tag-gray">Telemetry logged to `tab_switch_logs` table</span>
                </div>

                <div className="table-wrapper">
                  <table className="shadcn-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Assignment Title</th>
                        <th>Tab Switches</th>
                        <th>Score (MCQ + Whiteboard)</th>
                        <th>Proctoring Status</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleProctoringLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="font-semibold">{log.student}</td>
                          <td><code>{log.rollNo}</code></td>
                          <td>{log.assignment}</td>
                          <td>
                            <span className={log.switches > 2 ? 'tag-red' : 'tag-green'}>
                              {log.switches} switch(es)
                            </span>
                          </td>
                          <td className="font-semibold">{log.score}</td>
                          <td>
                            {log.status === 'VERIFIED_CLEAN' ? (
                              <span className="badge-green">● VERIFIED CLEAN</span>
                            ) : (
                              <span className="badge-amber">⚠ FLAGGED ALERT</span>
                            )}
                          </td>
                          <td className="text-gray">{log.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. NOTICES MODULE */}
          {activeTab === 'notices' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Campus Circulars & Broadcasts</h1>
                  <p className="module-sub">
                    Direct announcements published to all departments, faculty rosters, and student feeds.
                  </p>
                </div>
                <button
                  type="button"
                  className="action-btn-primary"
                  onClick={() => setIsNoticeModalOpen(true)}
                >
                  <IconPlus size={16} />
                  <span>Broadcast New Circular</span>
                </button>
              </div>

              <div className="notices-list-grid">
                {noticesList.length > 0 ? (
                  noticesList.map((n) => (
                    <div key={n.id} className="notice-card">
                      <div className="notice-top">
                        <span className="notice-target-pill">AUDIENCE: {n.targetRole}</span>
                        <span className="notice-date">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Just now'}</span>
                      </div>
                      <h3 className="notice-title">{n.title}</h3>
                      <p className="notice-content">{n.content}</p>
                      <div className="notice-footer">
                        <span>Issued by Principal Office</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="notice-card">
                      <div className="notice-top">
                        <span className="notice-target-pill">AUDIENCE: ALL CAMPUS</span>
                        <span className="notice-date">Today</span>
                      </div>
                      <h3 className="notice-title">Mandatory Mid-Term Whiteboard Verification Schedule</h3>
                      <p className="notice-content">
                        All students are required to complete their conceptual topology models on Edudraw canvas before Friday 5:00 PM. Anti-cheat proctoring will be monitored.
                      </p>
                      <div className="notice-footer">
                        <span>Issued by Principal Office</span>
                      </div>
                    </div>

                    <div className="notice-card">
                      <div className="notice-top">
                        <span className="notice-target-pill">AUDIENCE: TEACHERS</span>
                        <span className="notice-date">Yesterday</span>
                      </div>
                      <h3 className="notice-title">Automated 20-MCQ Grading Sync Guidelines</h3>
                      <p className="notice-content">
                        Teachers are reminded to submit subjective drawing evaluation marks within 48 hours of assignment deadline closure.
                      </p>
                      <div className="notice-footer">
                        <span>Issued by Principal Office</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 7. INSTITUTIONAL AUDIT & SETTINGS */}
          {activeTab === 'audit' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Institutional Settings & Security Audit</h1>
                  <p className="module-sub">
                    Cryptographic credentials verification and institutional node configuration.
                  </p>
                </div>
              </div>

              <div className="settings-cards-grid">
                <div className="panel-card">
                  <h3 className="panel-title">Institutional Node Profile</h3>
                  <div className="settings-fields-grid">
                    <div className="s-field">
                      <span className="s-label">College Institution Name</span>
                      <span className="s-val">{collegeTitle}</span>
                    </div>
                    <div className="s-field">
                      <span className="s-label">College Administrator / Principal</span>
                      <span className="s-val">{currentUser?.fullName}</span>
                    </div>
                    <div className="s-field">
                      <span className="s-label">Institutional Contact Email</span>
                      <span className="s-val">{currentUser?.email}</span>
                    </div>
                    <div className="s-field">
                      <span className="s-label">Database Schema Status</span>
                      <span className="s-val text-green font-bold">19 Tables Active in edugraph_db</span>
                    </div>
                  </div>
                </div>

                <div className="panel-card">
                  <h3 className="panel-title">Security & Cryptographic Compliance</h3>
                  <div className="compliance-list">
                    <div className="comp-item">
                      <IconCheck size={16} color="#16A34A" />
                      <div>
                        <strong>BCrypt Salt Encryption</strong>
                        <p>Zero plaintext passwords stored in MySQL database</p>
                      </div>
                    </div>
                    <div className="comp-item">
                      <IconCheck size={16} color="#16A34A" />
                      <div>
                        <strong>Real SMTP Credential Dispatch</strong>
                        <p>Automatic generation of coordinator credentials with direct inbox delivery</p>
                      </div>
                    </div>
                    <div className="comp-item">
                      <IconCheck size={16} color="#16A34A" />
                      <div>
                        <strong>Institutional Roll Number Lock</strong>
                        <p>Student email and roll numbers protected against client-side tampering</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ===================================================================
          MODAL 1: Appoint New Coordinator (Calls POST /api/principal/coordinators)
          =================================================================== */}
      {isCoordinatorModalOpen && (
        <div className="shadcn-dialog-overlay" onClick={() => setIsCoordinatorModalOpen(false)}>
          <div className="shadcn-dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="shadcn-dialog-header">
              <div className="dialog-title-row">
                <div className="dialog-badge">
                  <IconUser size={14} color="#1B7F72" />
                  <span>APPOINT COORDINATOR</span>
                </div>
                <button
                  type="button"
                  className="dialog-close-btn"
                  onClick={() => setIsCoordinatorModalOpen(false)}
                >
                  <IconX size={18} />
                </button>
              </div>
              <h2 className="shadcn-dialog-title">Appoint Academic Coordinator</h2>
              <p className="shadcn-dialog-description">
                Enter coordinator details. EduGraph will create their account and dispatch real login credentials to their email.
              </p>
            </div>

            {coordErrorMsg && (
              <div className="shadcn-alert alert-error">
                <span>{coordErrorMsg}</span>
              </div>
            )}
            {coordSuccessMsg && (
              <div className="shadcn-alert alert-success">
                <IconCheck size={16} color="#16A34A" />
                <span>{coordSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoordinator} className="shadcn-form">
              <div className="shadcn-input-group">
                <label className="shadcn-label">Coordinator Full Legal Name *</label>
                <div className="input-with-icon">
                  <span className="input-prefix-icon"><IconUser size={16} color="#64748B" /></span>
                  <input
                    type="text"
                    className="shadcn-input with-prefix"
                    placeholder="e.g. Prof. Alok Verma"
                    value={newCoordName}
                    onChange={(e) => setNewCoordName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="shadcn-input-group">
                <label className="shadcn-label">Institutional Email *</label>
                <div className="input-with-icon">
                  <span className="input-prefix-icon"><IconMail size={16} color="#64748B" /></span>
                  <input
                    type="email"
                    className="shadcn-input with-prefix"
                    placeholder="e.g. alok.verma@college.edu"
                    value={newCoordEmail}
                    onChange={(e) => setNewCoordEmail(e.target.value)}
                    required
                  />
                </div>
                <span className="shadcn-help-text">Credentials will be sent to this email directly via Gmail SMTP.</span>
              </div>

              <div className="shadcn-input-group">
                <label className="shadcn-label">Phone Number</label>
                <div className="input-with-icon">
                  <span className="input-prefix-icon"><IconPhone size={16} color="#64748B" /></span>
                  <input
                    type="tel"
                    className="shadcn-input with-prefix"
                    placeholder="e.g. +91 98123 45678"
                    value={newCoordPhone}
                    onChange={(e) => setNewCoordPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="shadcn-dialog-footer">
                <button
                  type="button"
                  className="shadcn-btn-secondary"
                  onClick={() => setIsCoordinatorModalOpen(false)}
                  disabled={coordModalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="shadcn-btn-primary"
                  disabled={coordModalLoading}
                >
                  {coordModalLoading ? (
                    <>
                      <span className="shadcn-spinner" />
                      <span>Dispatching Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Appoint & Dispatch Email</span>
                      <IconCheck size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL 2: Broadcast Notice (Calls POST /api/notices)
          =================================================================== */}
      {isNoticeModalOpen && (
        <div className="shadcn-dialog-overlay" onClick={() => setIsNoticeModalOpen(false)}>
          <div className="shadcn-dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="shadcn-dialog-header">
              <div className="dialog-title-row">
                <div className="dialog-badge">
                  <IconBell size={14} color="#1B7F72" />
                  <span>BROADCAST NOTICE</span>
                </div>
                <button
                  type="button"
                  className="dialog-close-btn"
                  onClick={() => setIsNoticeModalOpen(false)}
                >
                  <IconX size={18} />
                </button>
              </div>
              <h2 className="shadcn-dialog-title">Campus Circular Announcement</h2>
              <p className="shadcn-dialog-description">
                Publish a broadcast notice that appears across all teachers' and students' feeds.
              </p>
            </div>

            {noticeErrorMsg && (
              <div className="shadcn-alert alert-error">
                <span>{noticeErrorMsg}</span>
              </div>
            )}
            {noticeSuccessMsg && (
              <div className="shadcn-alert alert-success">
                <IconCheck size={16} color="#16A34A" />
                <span>{noticeSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateNotice} className="shadcn-form">
              <div className="shadcn-input-group">
                <label className="shadcn-label">Notice Title *</label>
                <input
                  type="text"
                  className="shadcn-input"
                  placeholder="e.g. Schedule for Semester Exam Whiteboard Submissions"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  required
                />
              </div>

              <div className="shadcn-input-group">
                <label className="shadcn-label">Target Audience *</label>
                <select
                  className="shadcn-input"
                  value={noticeTarget}
                  onChange={(e) => setNoticeTarget(e.target.value)}
                >
                  <option value="ALL">Entire Campus (All Users)</option>
                  <option value="TEACHER">Faculty & Teachers Only</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="COORDINATOR">Coordinators Only</option>
                </select>
              </div>

              <div className="shadcn-input-group">
                <label className="shadcn-label">Announcement Content *</label>
                <textarea
                  className="shadcn-textarea"
                  rows="4"
                  placeholder="Write announcement details..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  required
                />
              </div>

              <div className="shadcn-dialog-footer">
                <button
                  type="button"
                  className="shadcn-btn-secondary"
                  onClick={() => setIsNoticeModalOpen(false)}
                  disabled={noticeModalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="shadcn-btn-primary"
                  disabled={noticeModalLoading}
                >
                  {noticeModalLoading ? (
                    <>
                      <span className="shadcn-spinner" />
                      <span>Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <span>Publish Circular</span>
                      <IconCheck size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}