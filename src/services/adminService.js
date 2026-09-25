import api from './api'

export const adminService = {
  /**
   * Fetch platform-wide statistics across all institutions
   * Calls GET /api/admin/stats
   */
  async getPlatformStats() {
    try {
      const response = await api.get('/admin/stats')
      return response.data?.data || response.data
    } catch (err) {
      console.error('Error fetching admin platform stats', err.message)
      return null
    }
  },

  /**
   * Fetch all registered colleges/universities
   * Calls GET /api/admin/colleges
   */
  async getAllColleges() {
    try {
      const response = await api.get('/admin/colleges')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching all colleges', err.message)
      return []
    }
  },

  /**
   * Fetch all platform users across all institutions
   * Calls GET /api/admin/users
   */
  async getAllUsers() {
    try {
      const response = await api.get('/admin/users')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching all users', err.message)
      return []
    }
  },

  /**
   * Fetch all system support & data correction tickets
   * Calls GET /api/admin/tickets
   */
  async getAllTickets() {
    try {
      const response = await api.get('/admin/tickets')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching all tickets', err.message)
      return []
    }
  },

  /**
   * Toggle user active/suspended status
   * Calls PUT /api/admin/users/{id}/toggle-status
   */
  async toggleUserStatus(userId) {
    const response = await api.put(`/admin/users/${userId}/toggle-status`)
    return response.data?.data || response.data
  },

  /**
   * Fetch global platform notices
   * Calls GET /api/notices/my-feed
   */
  async getGlobalNotices() {
    try {
      const response = await api.get('/notices/my-feed')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching global notices', err.message)
      return []
    }
  },

  /**
   * Broadcast a new platform notice
   * Calls POST /api/notices
   */
  async createNotice(noticeData) {
    const response = await api.post('/notices', noticeData)
    return response.data?.data || response.data
  },

  /**
   * Delete a notice by ID
   * Calls DELETE /api/notices/{id}
   */
  async deleteNotice(noticeId) {
    const response = await api.delete(`/notices/${noticeId}`)
    return response.data?.data || response.data
  }
}

export default adminService
