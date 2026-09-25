import api from './api'

export const sharedService = {
  // ================= USER PROFILE =================

  /**
   * Fetch current authenticated user's profile details
   * GET /api/users/me
   */
  async getCurrentUserProfile() {
    try {
      const response = await api.get('/users/me')
      return response.data?.data || response.data
    } catch (err) {
      console.error('Error fetching user profile:', err.message)
      return null
    }
  },

  /**
   * Update authenticated user's profile
   * PUT /api/users/me
   */
  async updateProfile(profileData) {
    const response = await api.put('/users/me', profileData)
    return response.data?.data || response.data
  },

  /**
   * Change user password
   * PUT /api/users/me/password
   */
  async changePassword(passwordData) {
    const response = await api.put('/users/me/password', passwordData)
    return response.data?.data || response.data
  },

  // ================= NOTICES =================

  /**
   * Fetch personalized notices feed
   * GET /api/notices/my-feed
   */
  async getMyNotices() {
    try {
      const response = await api.get('/notices/my-feed')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching notices:', err.message)
      return []
    }
  },

  /**
   * Fetch notices for a specific college
   * GET /api/notices/college/{collegeId}
   */
  async getNoticesByCollege(collegeId) {
    try {
      const response = await api.get(`/notices/college/${collegeId}`)
      return response.data?.data || response.data || []
    } catch (err) {
      console.error(`Error fetching notices for college ${collegeId}:`, err.message)
      return []
    }
  },

  // ================= INSTITUTIONAL CALENDAR =================

  /**
   * Fetch calendar events for college
   * GET /api/calendar/college/{collegeId}
   */
  async getCalendarEvents(collegeId) {
    try {
      const response = await api.get(`/calendar/college/${collegeId}`)
      return response.data?.data || response.data || []
    } catch (err) {
      console.error(`Error fetching calendar events for college ${collegeId}:`, err.message)
      return []
    }
  },

  /**
   * Create calendar event (Admin/Principal)
   * POST /api/calendar
   */
  async createCalendarEvent(eventData) {
    const response = await api.post('/calendar', eventData)
    return response.data?.data || response.data
  },

  /**
   * Delete calendar event
   * DELETE /api/calendar/{id}
   */
  async deleteCalendarEvent(id) {
    const response = await api.delete(`/calendar/${id}`)
    return response.data?.data || response.data
  },

  // ================= NEWS & RESEARCH FEEDS =================

  /**
   * Fetch all college news items
   * GET /api/feeds/news
   */
  async getAllNews() {
    try {
      const response = await api.get('/feeds/news')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching news:', err.message)
      return []
    }
  },

  /**
   * Fetch all research publications
   * GET /api/feeds/research
   */
  async getAllResearchDocs() {
    try {
      const response = await api.get('/feeds/research')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching research docs:', err.message)
      return []
    }
  },

  /**
   * Publish or upload academic research document
   * POST /api/feeds/research
   */
  async uploadResearchDoc(docData) {
    const response = await api.post('/feeds/research', docData)
    return response.data?.data || response.data
  },

  // ================= HELP DESK & SUPPORT TICKETS =================

  /**
   * Fetch user's support tickets
   * GET /api/tickets/my-tickets
   */
  async getMyTickets() {
    try {
      const response = await api.get('/tickets/my-tickets')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching tickets:', err.message)
      return []
    }
  },

  /**
   * Create a support ticket
   * POST /api/tickets
   */
  async createTicket(ticketData) {
    const response = await api.post('/tickets', ticketData)
    return response.data?.data || response.data
  }
}

export default sharedService
