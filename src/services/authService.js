import api from './api'

export const authService = {
  /**
   * Log in user with email & password
   * Calls POST /api/auth/login
   */
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    })

    const payload = response.data?.data || response.data
    if (payload?.token) {
      this.saveAuthSession(payload.token, payload)
    }
    return payload
  },

  /**
   * Register Principal & College
   * Calls POST /api/principal/register
   */
  async registerPrincipal(formData) {
    const response = await api.post('/principal/register', {
      collegeName: formData.collegeName.trim(),
      collegeAddress: formData.collegeAddress?.trim() || '',
      contactEmail: formData.contactEmail?.trim() || formData.email.trim().toLowerCase(),
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    })

    const payload = response.data?.data || response.data
    if (payload?.token) {
      this.saveAuthSession(payload.token, payload)
    }
    return payload
  },

  /**
   * Send 6-digit OTP to user's registered email
   * Calls POST /api/auth/forgot-password/send-otp
   */
  async sendForgotPasswordOtp(email) {
    const response = await api.post('/auth/forgot-password/send-otp', {
      email: email.trim().toLowerCase(),
    })
    return response.data?.message || 'Verification code sent to your email.'
  },

  /**
   * Verify 6-digit OTP
   * Calls POST /api/auth/forgot-password/verify-otp
   */
  async verifyForgotPasswordOtp(email, otp) {
    const response = await api.post('/auth/forgot-password/verify-otp', {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
    })
    return response.data?.message || 'Verification code confirmed.'
  },

  /**
   * Reset Password with verified OTP
   * Calls POST /api/auth/forgot-password/reset-password
   */
  async resetPassword(email, otp, newPassword) {
    const response = await api.post('/auth/forgot-password/reset-password', {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
      newPassword,
    })
    return response.data?.message || 'Password reset successfully.'
  },

  /**
   * Save session tokens and user info in localStorage
   */
  saveAuthSession(token, user) {
    localStorage.setItem('edugraph_token', token)
    localStorage.setItem('edugraph_user', JSON.stringify(user))
  },

  /**
   * Retrieve active user session
   */
  getStoredUser() {
    try {
      const user = localStorage.getItem('edugraph_user')
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  /**
   * Retrieve active JWT token
   */
  getStoredToken() {
    return localStorage.getItem('edugraph_token')
  },

  /**
   * Log out and wipe local credentials
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('edugraph_token')
      localStorage.removeItem('edugraph_user')
    }
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return Boolean(this.getStoredToken())
  }
}

export default authService
