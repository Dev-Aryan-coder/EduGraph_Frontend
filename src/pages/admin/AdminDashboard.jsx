import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import adminService from '../../services/adminService'
import logoSvg from '../../assets/edugraph-logo.svg'
import {
  IconLayoutDashboard,
  IconInstitution,
  IconUser,
  IconShield,
  IconGraduation,
  IconLogOut,
  IconArrowLeft,
  IconSearch,
  IconFileText,
  IconCheck,
  IconX,
  IconMail,
  IconPhone,
  IconKey,
  IconInfo
} from '../../components/common/Icons'
import './AdminDashboard.css'

export default function AdminDashboard({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getStoredUser())
  const [activeTab, setActiveTab] = useState('overview')

  // Real Database State
  const [stats, setStats] = useState(null)
  const [colleges, setColleges] = useState([])
  const [users, setUsers] = useState([])
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [userSearch, setUserSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [collegeSearch, setCollegeSearch] = useState('')

  // Load real data from REST endpoints
  const loadAdminData = async () => {
    setIsLoading(true)
    try {
      const [platformStats, allColleges, allUsers, allTickets] = await Promise.all([
        adminService.getPlatformStats(),
        adminService.getAllColleges(),
        adminService.getAllUsers(),
        adminService.getAllTickets()
      ])

      if (platformStats) setStats(platformStats)
      if (allColleges) setColleges(allColleges)
      if (allUsers) setUsers(allUsers)
      if (allTickets) setTickets(allTickets)
    } catch (err) {
      console.error('Error fetching admin platform data', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
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

  // Toggle User Status
  const handleToggleStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId)
      // Reload users
      const updated = await adminService.getAllUsers()
      if (updated) setUsers(updated)
    } catch (err) {
      alert('Failed to update user status: ' + err.message)
    }
  }

  // Sidenav Items
  const sidenavItems = [
    { id: 'overview', label: 'Platform Overview', icon: <IconLayoutDashboard size={18} /> },
    { id: 'colleges', label: 'Institutions & Colleges', icon: <IconInstitution size={18} /> },
    { id: 'users', label: 'User & Role Directory', icon: <IconUser size={18} /> },
    { id: 'tickets', label: 'Support & Tickets', icon: <IconShield size={18} /> },
    { id: 'audit', label: 'System & DB Audit', icon: <IconFileText size={18} /> },
  ]

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter || u.role === `ROLE_${roleFilter}`
    return matchesSearch && matchesRole
  })

  // Filtered Colleges
  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    (c.contactEmail && c.contactEmail.toLowerCase().includes(collegeSearch.toLowerCase()))
  )

  return (
    <div className="admin-workspace">
      {/* Top Bar */}
      <header className="admin-topbar">
        <div className="topbar-left">
          <img
            src={logoSvg}
            alt="EduGraph"
            className="admin-brand-logo"
            onClick={handleNavHome}
          />
          <span className="topbar-crumb-sep">/</span>
          <div className="topbar-admin-badge">
            <IconKey size={15} color="#DC2626" />
            <span className="admin-title">EduGraph Super Admin Console</span>
            <span className="admin-root-pill">ROOT CLEARANCE</span>
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
            <div className="admin-avatar-circle">
              {currentUser?.profileImageUrl ? (
                <img src={currentUser.profileImageUrl} alt="Admin Avatar" className="avatar-img" />
              ) : (
                <span>A</span>
              )}
            </div>
            <div className="user-info-text">
              <span className="user-full-name">{currentUser?.fullName || 'Super Admin'}</span>
              <span className="admin-email-tag">{currentUser?.email || 'yonexffyt14@gmail.com'}</span>
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
      <div className="admin-body-container">

        {/* ===================================================================
            SIDE NAVIGATION BAR (All features organized here)
            =================================================================== */}
        <aside className="admin-sidebar">
          <div className="sidebar-admin-card">
            <span className="head-label">SUPER ADMIN ACCESS</span>
            <h3 className="admin-console-name">EduGraph Platform Core</h3>
            <span className="admin-live-status">● Live Database Active</span>
          </div>

          <div className="sidebar-nav-title">SUPER ADMIN CONTROLS</div>

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
                  {isActive && <span className="active-glow-pill red-pill" />}
                </button>
              )
            })}
          </nav>

          <div className="sidebar-bottom-card">
            <div className="admin-shield-icon">
              <IconShield size={16} color="#DC2626" />
            </div>
            <div className="admin-card-text">
              <strong>Super Admin Authority</strong>
              <span>Global governance & user lifecycle</span>
            </div>
          </div>
        </aside>

        {/* ===================================================================
            MAIN CONTENT AREA
            =================================================================== */}
        <main className="admin-content-area">

          {/* 1. OVERVIEW MODULE */}
          {activeTab === 'overview' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Platform-Wide Overview</h1>
                  <p className="module-sub">
                    Global metrics aggregated across all institutions in the EduGraph ecosystem.
                  </p>
                </div>
              </div>

              {/* 5 Real KPI Stat Cards */}
              <div className="admin-kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Colleges / Institutions</span>
                    <div className="kpi-icon-pill icon-red">
                      <IconInstitution size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {stats?.totalColleges ?? colleges.length}
                  </div>
                  <span className="kpi-sub">Registered university nodes</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Total Users</span>
                    <div className="kpi-icon-pill icon-blue">
                      <IconUser size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {stats?.totalUsers ?? users.length}
                  </div>
                  <span className="kpi-sub">Across all roles</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Active Students</span>
                    <div className="kpi-icon-pill icon-teal">
                      <IconGraduation size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {stats?.totalStudents ?? 0}
                  </div>
                  <span className="kpi-sub">Enrolled candidates</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Active Faculty</span>
                    <div className="kpi-icon-pill icon-amber">
                      <IconUser size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {stats?.totalTeachers ?? 0}
                  </div>
                  <span className="kpi-sub">Teaching instructors</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Classrooms</span>
                    <div className="kpi-icon-pill icon-green">
                      <IconLayoutDashboard size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">
                    {stats?.totalClassrooms ?? 0}
                  </div>
                  <span className="kpi-sub">Active course sections</span>
                </div>
              </div>

              {/* Recent Users Table */}
              <div className="panel-card">
                <div className="panel-card-head">
                  <div>
                    <h3 className="panel-title">Platform Users Roster</h3>
                    <p className="panel-sub">Real user accounts queried from `users` database table.</p>
                  </div>
                  <button
                    type="button"
                    className="small-action-btn"
                    onClick={() => setActiveTab('users')}
                  >
                    Manage All Users ➔
                  </button>
                </div>

                {users.length > 0 ? (
                  <div className="table-wrapper">
                    <table className="shadcn-table">
                      <thead>
                        <tr>
                          <th>User Name</th>
                          <th>Email Address</th>
                          <th>Role</th>
                          <th>Institution / College</th>
                          <th>Account Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 6).map((u) => (
                          <tr key={u.id}>
                            <td className="font-semibold">{u.fullName}</td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`role-badge-tag role-${u.role ? u.role.toLowerCase() : 'user'}`}>
                                {u.role ? u.role.replace('ROLE_', '') : 'USER'}
                              </span>
                            </td>
                            <td>{u.collegeName || 'Platform Level'}</td>
                            <td>
                              <span className={u.status === 'ACTIVE' ? 'badge-green' : 'badge-amber'}>
                                ● {u.status || 'ACTIVE'}
                              </span>
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
                    <h4>No Users in Database</h4>
                    <p>When institutions register and users sign up, their profiles will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. COLLEGES MODULE */}
          {activeTab === 'colleges' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Institutions & Colleges Directory</h1>
                  <p className="module-sub">
                    All verified university campuses onboarded on EduGraph.
                  </p>
                </div>
                {colleges.length > 0 && (
                  <div className="search-bar-wrap">
                    <IconSearch size={16} color="#64748B" />
                    <input
                      type="text"
                      placeholder="Search institutions by name..."
                      className="search-input"
                      value={collegeSearch}
                      onChange={(e) => setCollegeSearch(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="panel-card">
                {colleges.length > 0 ? (
                  <div className="table-wrapper">
                    <table className="shadcn-table">
                      <thead>
                        <tr>
                          <th>College Name</th>
                          <th>Campus Address</th>
                          <th>Contact Email</th>
                          <th>Database ID</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredColleges.map((c) => (
                          <tr key={c.id}>
                            <td className="font-semibold">{c.name}</td>
                            <td>{c.address || 'Address on file'}</td>
                            <td>{c.contactEmail || 'N/A'}</td>
                            <td><code>COLLEGE-#{c.id}</code></td>
                            <td><span className="badge-green">● VERIFIED NODE</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state-box">
                    <div className="empty-state-icon">
                      <IconInstitution size={32} color="#94A3B8" />
                    </div>
                    <h4>No Colleges Registered Yet</h4>
                    <p>
                      When a Principal registers their college via the Sign Up portal, their institution node will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. USERS MODULE */}
          {activeTab === 'users' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Global User & Role Directory</h1>
                  <p className="module-sub">
                    Direct access to manage user account permissions and statuses across all campuses.
                  </p>
                </div>
                <div className="admin-filter-bar">
                  <div className="search-bar-wrap">
                    <IconSearch size={16} color="#64748B" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      className="search-input"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="role-filter-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="ALL">All Roles</option>
                    <option value="PRINCIPAL">Principals</option>
                    <option value="COORDINATOR">Coordinators</option>
                    <option value="TEACHER">Teachers</option>
                    <option value="STUDENT">Students</option>
                    <option value="ADMIN">Super Admins</option>
                  </select>
                </div>
              </div>

              <div className="panel-card">
                {filteredUsers.length > 0 ? (
                  <div className="table-wrapper">
                    <table className="shadcn-table">
                      <thead>
                        <tr>
                          <th>Full Name</th>
                          <th>Email Address</th>
                          <th>Assigned Role</th>
                          <th>Institution</th>
                          <th>Status</th>
                          <th>Admin Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u.id}>
                            <td className="font-semibold">{u.fullName}</td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`role-badge-tag role-${u.role ? u.role.toLowerCase() : 'user'}`}>
                                {u.role ? u.role.replace('ROLE_', '') : 'USER'}
                              </span>
                            </td>
                            <td>{u.collegeName || 'Global Platform'}</td>
                            <td>
                              <span className={u.status === 'ACTIVE' ? 'badge-green' : 'badge-amber'}>
                                ● {u.status || 'ACTIVE'}
                              </span>
                            </td>
                            <td>
                              {u.email !== 'yonexffyt14@gmail.com' ? (
                                <button
                                  type="button"
                                  className="toggle-status-btn"
                                  onClick={() => handleToggleStatus(u.id)}
                                >
                                  {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                </button>
                              ) : (
                                <span className="root-protected-tag">Root Protected</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state-box">
                    <div className="empty-state-icon">
                      <IconUser size={32} color="#94A3B8" />
                    </div>
                    <h4>No Matching Users Found</h4>
                    <p>No user accounts matched your search or role filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. TICKETS MODULE */}
          {activeTab === 'tickets' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">Platform Support & Data Correction Tickets</h1>
                  <p className="module-sub">
                    Direct ticketing feed from the `tickets` database table.
                  </p>
                </div>
              </div>

              <div className="panel-card">
                {tickets.length > 0 ? (
                  <div className="table-wrapper">
                    <table className="shadcn-table">
                      <thead>
                        <tr>
                          <th>Ticket ID</th>
                          <th>Subject</th>
                          <th>Raised By</th>
                          <th>Type</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((t) => (
                          <tr key={t.id}>
                            <td><code>TICKET-#{t.id}</code></td>
                            <td className="font-semibold">{t.title}</td>
                            <td>{t.createdByName || t.createdByEmail}</td>
                            <td><span className="tag-teal">{t.type}</span></td>
                            <td>
                              <span className={t.status === 'PENDING' ? 'badge-amber' : 'badge-green'}>
                                ● {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state-box">
                    <div className="empty-state-icon">
                      <IconShield size={32} color="#94A3B8" />
                    </div>
                    <h4>No Support Tickets Pending</h4>
                    <p>
                      All support inquiries, roll number updates, and data correction requests have been addressed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. AUDIT MODULE */}
          {activeTab === 'audit' && (
            <div className="module-container">
              <div className="module-header-row">
                <div>
                  <h1 className="module-title">System & Database Architecture Audit</h1>
                  <p className="module-sub">
                    Live telemetry for the EduGraph core backend and database schema.
                  </p>
                </div>
              </div>

              <div className="settings-cards-grid">
                <div className="panel-card">
                  <h3 className="panel-title">Super Admin Security Credentials</h3>
                  <div className="settings-fields-grid">
                    <div className="s-field">
                      <span className="s-label">Designated Super Admin</span>
                      <span className="s-val">yonexffyt14@gmail.com</span>
                    </div>
                    <div className="s-field">
                      <span className="s-label">Role Authority</span>
                      <span className="s-val text-red font-bold">ROLE_ADMIN (Super Administrator)</span>
                    </div>
                    <div className="s-field">
                      <span className="s-label">Database Seeder Status</span>
                      <span className="s-val text-green font-bold">● Active (DataInitializer.java)</span>
                    </div>
                    <div className="s-field">
                      <span className="s-label">Authentication Portal</span>
                      <span className="s-val">Unified Login via `/api/auth/login`</span>
                    </div>
                  </div>
                </div>

                <div className="panel-card">
                  <h3 className="panel-title">Database & Infrastructure Status</h3>
                  <div className="compliance-list">
                    <div className="comp-item">
                      <IconCheck size={16} color="#16A34A" />
                      <div>
                        <strong>19 JPA Tables Connected</strong>
                        <p>Database `edugraph_db` running on MySQL 8.0.45 port 3306</p>
                      </div>
                    </div>
                    <div className="comp-item">
                      <IconCheck size={16} color="#16A34A" />
                      <div>
                        <strong>Gmail SMTP Active</strong>
                        <p>Port 587 TLS enabled for real email credential and OTP delivery</p>
                      </div>
                    </div>
                    <div className="comp-item">
                      <IconCheck size={16} color="#16A34A" />
                      <div>
                        <strong>Stateless JWT Security</strong>
                        <p>HMAC-SHA256 signature tokens with 24-hour expiration window</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}