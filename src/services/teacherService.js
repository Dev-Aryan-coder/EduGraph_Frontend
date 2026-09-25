import api from './api'

export const teacherService = {
  /**
   * Fetch all classrooms assigned to the logged-in teacher
   * Calls GET /api/classrooms/my-classrooms
   */
  async getMyClassrooms() {
    try {
      const response = await api.get('/classrooms/my-classrooms')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching teacher classrooms:', err.message)
      return []
    }
  },

  /**
   * Fetch students enrolled in a specific classroom
   * Calls GET /api/classrooms/{id}/students
   */
  async getClassroomStudents(classroomId) {
    try {
      const response = await api.get(`/classrooms/${classroomId}/students`)
      return response.data?.data || response.data || []
    } catch (err) {
      console.error(`Error fetching students for classroom ${classroomId}:`, err.message)
      return []
    }
  },

  /**
   * Fetch all assignments authored by the logged-in teacher
   * Calls GET /api/assignments/my-authored
   */
  async getMyAuthoredAssignments() {
    try {
      const response = await api.get('/assignments/my-authored')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching authored assignments:', err.message)
      return []
    }
  },

  /**
   * Fetch assignments for a specific classroom
   * Calls GET /api/assignments/classroom/{classroomId}
   */
  async getAssignmentsByClassroom(classroomId) {
    try {
      const response = await api.get(`/assignments/classroom/${classroomId}`)
      return response.data?.data || response.data || []
    } catch (err) {
      console.error(`Error fetching assignments for classroom ${classroomId}:`, err.message)
      return []
    }
  },

  /**
   * Fetch assignment details by ID
   * Calls GET /api/assignments/{id}
   */
  async getAssignmentById(id) {
    const response = await api.get(`/assignments/${id}`)
    return response.data?.data || response.data
  },

  /**
   * Create a new assignment with exactly 20 MCQ questions
   * Calls POST /api/assignments
   */
  async createAssignment(assignmentData) {
    const response = await api.post('/assignments', assignmentData)
    return response.data?.data || response.data
  },

  /**
   * Extend assignment deadline by up to 48 hours with logged mandatory reason
   * Calls POST /api/assignments/{id}/extend-deadline
   */
  async extendDeadline(assignmentId, { extensionHours, reason }) {
    const response = await api.post(`/assignments/${assignmentId}/extend-deadline`, {
      extensionHours: Number(extensionHours),
      reason
    })
    return response.data?.data || response.data
  },

  /**
   * Delete an assignment
   * Calls DELETE /api/assignments/{id}
   */
  async deleteAssignment(id) {
    const response = await api.delete(`/assignments/${id}`)
    return response.data?.data || response.data
  },

  /**
   * Fetch statistics for an assignment
   * Calls GET /api/assignments/{id}/stats
   */
  async getAssignmentStats(id) {
    try {
      const response = await api.get(`/assignments/${id}/stats`)
      return response.data?.data || response.data
    } catch (err) {
      console.error(`Error fetching stats for assignment ${id}:`, err.message)
      return null
    }
  },

  /**
   * Fetch all student submissions for an assignment
   * Calls GET /api/submissions/assignment/{assignmentId}/all
   */
  async getSubmissionsForAssignment(assignmentId) {
    try {
      const response = await api.get(`/submissions/assignment/${assignmentId}/all`)
      return response.data?.data || response.data || []
    } catch (err) {
      console.error(`Error fetching submissions for assignment ${assignmentId}:`, err.message)
      return []
    }
  },

  /**
   * Fetch a single submission record by ID (includes drawing draft and tab switch count)
   * Calls GET /api/submissions/{id}
   */
  async getSubmissionById(id) {
    const response = await api.get(`/submissions/${id}`)
    return response.data?.data || response.data
  },

  /**
   * Grade a submission (drawing marks out of 10 + feedback + optional reject)
   * Calls POST /api/grading/submission/{submissionId}
   */
  async gradeSubmission(submissionId, { drawingScore, teacherFeedback, reject = false }) {
    const response = await api.post(`/grading/submission/${submissionId}`, {
      drawingScore: Number(drawingScore),
      teacherFeedback,
      reject: Boolean(reject)
    })
    return response.data?.data || response.data
  },

  /**
   * Fetch the authored 20 MCQs with answer keys for an assignment
   * Calls GET /api/mcq/assignment/{assignmentId}/teacher-view
   */
  async getAssignmentMCQs(assignmentId) {
    try {
      const response = await api.get(`/mcq/assignment/${assignmentId}/teacher-view`)
      return response.data?.data || response.data || []
    } catch (err) {
      console.error(`Error fetching MCQs for assignment ${assignmentId}:`, err.message)
      return []
    }
  },

  /**
   * Fetch teacher's support tickets (data-correction & permission-overrides)
   * Calls GET /api/tickets/my-tickets
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
   * Calls POST /api/tickets
   */
  async createTicket(ticketData) {
    const response = await api.post('/tickets', ticketData)
    return response.data?.data || response.data
  },

  /**
   * Get college feed news
   * Calls GET /api/feeds/news
   */
  async getNews() {
    try {
      const response = await api.get('/feeds/news')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching news:', err.message)
      return []
    }
  },

  /**
   * Get research documents
   * Calls GET /api/feeds/research
   */
  async getResearchDocs() {
    try {
      const response = await api.get('/feeds/research')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching research docs:', err.message)
      return []
    }
  },

  /**
   * Upload / share academic research document
   * Calls POST /api/feeds/research
   */
  async uploadResearchDoc(docData) {
    const response = await api.post('/feeds/research', docData)
    return response.data?.data || response.data
  }
}

export default teacherService
