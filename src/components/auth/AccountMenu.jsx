import React, { useState, useEffect, useRef } from 'react'
import authService from '../../services/authService'
import ProfileSettingsModal from './ProfileSettingsModal'
import AccountSettingsModal from './AccountSettingsModal'
import {
  IconUser,
  IconLayoutDashboard,
  IconSettings,
  IconLogOut,
  IconChevronDown,
  IconShield,
  IconInstitution
} from '../common/Icons'
import './AccountMenu.css'

export default function AccountMenu({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getStoredUser())
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [imgError, setImgError] = useState(false)

  const dropdownRef = useRef(null)

  // Listen to auth changes and profile updates
  useEffect(() => {
    const handleAuthChange = () => {
      const user = authService.getStoredUser()
      setCurrentUser(user)
      setImgError(false)
    }

    window.addEventListener('edugraph_auth_change', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    return () => {
      window.removeEventListener('edugraph_auth_change', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  if (!currentUser) return null

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const handleLogout = async () => {
    setIsDropdownOpen(false)
    await authService.logout()
    if (onNavigate) {
      onNavigate('home')
    } else {
      window.location.hash = '#home'
    }
  }

  const handleDashboardClick = () => {
    setIsDropdownOpen(false)
    const role = currentUser?.role ? currentUser.role.toUpperCase() : ''
    const targetTab = (role === 'ADMIN' || role === 'ROLE_ADMIN')
      ? 'admin'
      : (role === 'COORDINATOR' || role === 'ROLE_COORDINATOR')
        ? 'coordinator'
        : 'dashboard'
    if (onNavigate) {
      onNavigate(targetTab)
    } else {
      window.location.hash = `#${targetTab}`
    }
  }

  const handleProfileModalOpen = () => {
    setIsDropdownOpen(false)
    setIsProfileModalOpen(true)
  }

  const handleAccountModalOpen = () => {
    setIsDropdownOpen(false)
    setIsAccountModalOpen(true)
  }

  const roleBadge = (currentUser.role || 'MEMBER').replace('ROLE_', '')

  return (
    <div className="shadcn-account-wrapper" ref={dropdownRef}>
      {/* Account Symbol / Avatar Trigger Button */}
      <button
        type="button"
        className={`account-trigger-btn ${isDropdownOpen ? 'active' : ''}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <div className="account-avatar-ring">
          {currentUser.profileImageUrl && !imgError ? (
            <img
              src={currentUser.profileImageUrl}
              alt={currentUser.fullName || 'User Avatar'}
              className="account-avatar-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="account-avatar-fallback">
              {getInitials(currentUser.fullName)}
            </div>
          )}
          <span className="account-online-dot" />
        </div>

        <div className="account-trigger-meta">
          <span className="account-user-name">
            {currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Account'}
          </span>
          <span className="account-role-tag">{roleBadge}</span>
        </div>

        <span className={`account-chevron ${isDropdownOpen ? 'rotated' : ''}`}>
          <IconChevronDown size={14} />
        </span>
      </button>

      {/* Shadcn UI Style Dropdown Menu */}
      {isDropdownOpen && (
        <div className="shadcn-dropdown-menu" role="menu">
          {/* Header Card */}
          <div className="dropdown-user-header">
            <div className="header-avatar-circle">
              {currentUser.profileImageUrl && !imgError ? (
                <img
                  src={currentUser.profileImageUrl}
                  alt={currentUser.fullName || 'Avatar'}
                  className="header-avatar-img"
                />
              ) : (
                <div className="header-avatar-fallback">
                  {getInitials(currentUser.fullName)}
                </div>
              )}
            </div>

            <div className="header-user-info">
              <div className="header-name-row">
                <span className="header-user-name">{currentUser.fullName}</span>
                <span className="header-role-chip">{roleBadge}</span>
              </div>
              <span className="header-user-email">{currentUser.email}</span>
              {currentUser.collegeName && (
                <span className="header-college-name">
                  <IconInstitution size={12} color="#64748B" />
                  {currentUser.collegeName}
                </span>
              )}
            </div>
          </div>

          <div className="dropdown-divider" />

          {/* Option 1: Dashboard */}
          <button
            type="button"
            className="dropdown-menu-item"
            role="menuitem"
            onClick={handleDashboardClick}
          >
            <div className="item-icon-box box-teal">
              <IconLayoutDashboard size={16} color="#1B7F72" />
            </div>
            <div className="item-text-box">
              <span className="item-title">Dashboard</span>
              <span className="item-desc">Access academic workspace & features</span>
            </div>
          </button>

          {/* Option 2: Profile Settings */}
          <button
            type="button"
            className="dropdown-menu-item"
            role="menuitem"
            onClick={handleProfileModalOpen}
          >
            <div className="item-icon-box box-blue">
              <IconUser size={16} color="#2563EB" />
            </div>
            <div className="item-text-box">
              <span className="item-title">Profile Settings</span>
              <span className="item-desc">Edit photo URL, name & personal details</span>
            </div>
          </button>

          {/* Option 3: Account Settings */}
          <button
            type="button"
            className="dropdown-menu-item"
            role="menuitem"
            onClick={handleAccountModalOpen}
          >
            <div className="item-icon-box box-amber">
              <IconSettings size={16} color="#D97706" />
            </div>
            <div className="item-text-box">
              <span className="item-title">Account Settings</span>
              <span className="item-desc">Reset password & security credentials</span>
            </div>
          </button>

          <div className="dropdown-divider" />

          {/* Option 4: Sign Out */}
          <button
            type="button"
            className="dropdown-menu-item item-logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <div className="item-icon-box box-red">
              <IconLogOut size={16} color="#DC2626" />
            </div>
            <div className="item-text-box">
              <span className="item-title">Sign Out</span>
              <span className="item-desc">End your active academic session</span>
            </div>
          </button>
        </div>
      )}

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => {
          if (updated) setCurrentUser(updated)
        }}
      />

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </div>
  )
}
