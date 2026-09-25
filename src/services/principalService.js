import api from './api'

export const principalService = {
  /**
   * Get college overview stats
   * Calls GET /api/principal/overview
   */
  async getOverview() {
    try {
      const response = await api.get('/principal/overview')
      return response.data?.data || response.data
    } catch (err) {
      console.warn('Error fetching principal overview', err.message)
      return null
    }
  },

  /**
   * Get broader admin dashboard statistics
   * Calls GET /api/admin/dashboard/stats
   */
  async getAdminStats() {
    try {
      const response = await api.get('/admin/dashboard/stats')
      return response.data?.data || response.data
    } catch (err) {
      console.warn('Error fetching admin stats', err.message)
      return null
    }
  },

  /**
   * Get real list of appointed coordinators from MySQL
   * Calls GET /api/principal/coordinators
   */
  async getCoordinators() {
    try {
      const response = await api.get('/principal/coordinators')
      return response.data?.data || response.data || []
    } catch (err) {
      console.warn('Error fetching coordinators', err.message)
      return []
    }
  },

  /**
   * Get real list of teachers in this college from MySQL
   * Calls GET /api/principal/teachers
   */
  async getTeachers() {
    try {
      const response = await api.get('/principal/teachers')
      return response.data?.data || response.data || []
    } catch (err) {
      console.warn('Error fetching teachers', err.message)
      return []
    }
  },

  /**
   * Get real list of classrooms in this college from MySQL
   * Calls GET /api/principal/classrooms
   */
  async getClassrooms() {
    try {
      const response = await api.get('/principal/classrooms')
      return response.data?.data || response.data || []
    } catch (err) {
      console.warn('Error fetching classrooms', err.message)
      return []
    }
  },

  /**
   * Appoint new coordinator (triggers real email credentials dispatch via SMTP)
   * Calls POST /api/principal/coordinators
   */
  async createCoordinator(data) {
    const response = await api.post('/principal/coordinators', {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phoneNumber: data.phoneNumber?.trim() || null,
    })
    return response.data?.data || response.data
  },

  /**
   * Broadcast campus circular / notice
   * Calls POST /api/notices
   */
  async createNotice(data) {
    const response = await api.post('/notices', {
      title: data.title.trim(),
      content: data.content.trim(),
      targetRole: data.targetRole || 'ALL',
      expiresAt: data.expiresAt || null,
    })
    return response.data?.data || response.data
  },

  /**
   * Get real campus notices feed from MySQL
   * Calls GET /api/notices/my-feed
   */
  async getNoticesFeed() {
    try {
      const response = await api.get('/notices/my-feed')
      return response.data?.data || response.data || []
    } catch (err) {
      console.warn('Error fetching notices', err.message)
      return []
    }
  }
}

export default principalService
