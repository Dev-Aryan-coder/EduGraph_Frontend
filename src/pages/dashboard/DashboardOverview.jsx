import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import logoSvg from '../../assets/edugraph-logo.svg'
import {
  IconLayoutDashboard,
  IconInstitution,
  IconPencil,
  IconBrain,
  IconShield,
  IconTarget,
  IconGraduation,
  IconUser,
  IconLogOut,
  IconArrowLeft,
  IconBadgeId,
  IconLock
} from '../../components/common/Icons'
import './DashboardOverview.css'

export default function DashboardOverview({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getStoredUser())
  const [activeMenu, setActiveMenu] = useState('overview')

  useEffect(() => {
    const handleAuth = () => setCurrentUser(authService.getStoredUser())
    window.addEventListener('edugraph_auth_change', handleAuth)
    return () => window.removeEventListener('edugraph_auth_change', handleAuth)
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

  const role = (currentUser?.role || 'MEMBER').replace('ROLE_', '')

  // Role-based sidebar nav items
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <IconLayoutDashboard size={18} /> },
    { id: 'whiteboard', label: 'Edudraw Canvas', icon: <IconPencil size={18} /> },
    { id: 'quizzes', label: '20-MCQ Quizzes', icon: <IconBrain size={18} /> },
    { id: 'topology', label: 'Knowledge Topology', icon: <IconTarget size={18} /> },
    { id: 'proctoring', label: 'Anti-Cheat Monitor', icon: <IconShield size={18} /> },
    ...(role === 'PRINCIPAL' || role === 'COORDINATOR'
      ? [
          { id: 'institution', label: 'College Faculty', icon: <IconInstitution size={18} /> },
          { id: 'classrooms', label: 'Classrooms & Sections', icon: <IconGraduation size={18} /> },
        ]
      : []),
  ]

  return (
    <div className="dashboard-layout">
      {/* Top Bar */}
      <header className="dashboard-topbar">
        <div className="topbar-left">
          <img
            src={logoSvg}
            alt="EduGraph"
            className="dashboard-logo"
            onClick={handleNavHome}
          />
          <span className="topbar-sep">/</span>
          <span className="topbar-title">Institutional Workspace</span>
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className="topbar-home-btn"
            onClick={handleNavHome}
          >
            <IconArrowLeft size={16} />
            <span>Public Site</span>
          </button>

          <div className="topbar-user-pill">
            <div className="pill-avatar">
              {currentUser?.profileImageUrl ? (
                <img src={currentUser.profileImageUrl} alt="Avatar" className="pill-img" />
              ) : (
                <span>{(currentUser?.fullName || 'U').charAt(0)}</span>
              )}
            </div>
            <div className="pill-text">
              <span className="pill-name">{currentUser?.fullName || 'User'}</span>
              <span className="pill-role">{role}</span>
            </div>
          </div>

          <button
            type="button"
            className="topbar-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
          >
            <IconLogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Dashboard Body: Sidenav + Content */}
      <div className="dashboard-main-area">
        {/* Left Side Navigation Bar */}
        <aside className="dashboard-sidenav">
          <div className="sidenav-college-card">
            <IconInstitution size={20} color="#1B7F72" />
            <div className="college-info">
              <span className="college-name">
                {currentUser?.collegeName || 'EduGraph University'}
              </span>
              <span className="college-status">● Institutional Node</span>
            </div>
          </div>

          <div className="sidenav-section-label">WORKSPACE MODULES</div>

          <nav className="sidenav-menu">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`sidenav-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.id)}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
                {activeMenu === item.id && <span className="active-dot" />}
              </button>
            ))}
          </nav>

          <div className="sidenav-footer">
            <div className="footer-credential-pill">
              <IconBadgeId size={14} color="#64748B" />
              <span>{currentUser?.email}</span>
            </div>
          </div>
        </aside>

        {/* Dashboard Content Stage */}
        <main className="dashboard-content">
          <div className="content-welcome-banner">
            <div className="welcome-text">
              <span className="welcome-eyebrow">WELCOME BACK • {role} DASHBOARD</span>
              <h1 className="welcome-title">
                Hello, {currentUser?.fullName || 'Colleague'}
              </h1>
              <p className="welcome-sub">
                You are currently in the <strong>{activeMenu.toUpperCase()}</strong> module for {currentUser?.collegeName || 'your institution'}.
              </p>
            </div>
            <div className="welcome-role-badge">
              <IconShield size={20} color="#1B7F72" />
              <span>{role} CLEARANCE</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Account Status</span>
              <span className="metric-value text-green">● Active</span>
              <span className="metric-sub">Verified Identity</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Institutional Role</span>
              <span className="metric-value">{role}</span>
              <span className="metric-sub">Role-Based Access</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Whiteboard Workspaces</span>
              <span className="metric-value">Active</span>
              <span className="metric-sub">Anti-cheat tracking on</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Security Protocol</span>
              <span className="metric-value">JWT Bearer</span>
              <span className="metric-sub">SHA-256 Protected</span>
            </div>
          </div>

          {/* Notice Card */}
          <div className="dashboard-placeholder-card">
            <div className="placeholder-icon">
              <IconLayoutDashboard size={32} color="#1B7F72" />
            </div>
            <h2>{sidebarItems.find(i => i.id === activeMenu)?.label} Module Initialized</h2>
            <p>
              Your account menu, avatar URL configuration, and profile/security modals are fully operational.
              We are now ready to build out each comprehensive screen for this module.
            </p>
            <button
              type="button"
              className="placeholder-btn"
              onClick={handleNavHome}
            >
              Return to Public Portal ➔
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
