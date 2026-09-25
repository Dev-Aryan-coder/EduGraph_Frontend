import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getStoredUser())
  const [token, setToken] = useState(() => authService.getStoredToken())
  const [isLoading, setIsLoading] = useState(false)

  // Synchronize across tabs and storage events
  const syncAuthState = useCallback(() => {
    setUser(authService.getStoredUser())
    setToken(authService.getStoredToken())
  }, [])

  useEffect(() => {
    window.addEventListener('edugraph_auth_change', syncAuthState)
    window.addEventListener('storage', syncAuthState)
    return () => {
      window.removeEventListener('edugraph_auth_change', syncAuthState)
      window.removeEventListener('storage', syncAuthState)
    }
  }, [syncAuthState])

  /**
   * Log in user with credentials
   */
  const login = async (email, password) => {
    setIsLoading(true)
    try {
      const response = await authService.login(email, password)
      syncAuthState()
      return response
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Log out user and wipe tokens
   */
  const logout = () => {
    authService.logout()
    setUser(null)
    setToken(null)
  }

  /**
   * Update user details in state & storage
   */
  const updateUser = (updatedFields) => {
    const current = authService.getStoredUser()
    if (current) {
      const merged = { ...current, ...updatedFields }
      localStorage.setItem('edugraph_user', JSON.stringify(merged))
      setUser(merged)
      window.dispatchEvent(new Event('edugraph_auth_change'))
    }
  }

  /**
   * Role validation helper
   */
  const hasRole = (roleOrRoles) => {
    if (!user || !user.role) return false
    const userRole = user.role.toUpperCase().replace('ROLE_', '')
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.some(r => r.toUpperCase().replace('ROLE_', '') === userRole)
    }
    return roleOrRoles.toUpperCase().replace('ROLE_', '') === userRole
  }

  const role = (user?.role || '').toUpperCase().replace('ROLE_', '')
  const isAuthenticated = Boolean(token && user)

  const value = {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    hasRole,
    syncAuthState
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext