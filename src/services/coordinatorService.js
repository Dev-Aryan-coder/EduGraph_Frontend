import api from './api'

export const coordinatorService = {
  /**
   * Fetch overview metrics for the Coordinator's college
   * Calls GET /api/coordinator/overview
   */
  async getOverview() {
    try {
      const response = await api.get('/coordinator/overview')
      return response.data?.data || response.data
    } catch (err) {
      console.error('Error fetching coordinator overview:', err.message)
      return null
    }
  },

  /**
   * Fetch all students under the coordinator's college
   * Calls GET /api/coordinator/students
   */
  async getStudents() {
    try {
      const response = await api.get('/coordinator/students')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching students:', err.message)
      return []
    }
  },

  /**
   * Fetch all teachers under the coordinator's college
   * Calls GET /api/coordinator/teachers
   */
  async getTeachers() {
    try {
      const response = await api.get('/coordinator/teachers')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching teachers:', err.message)
      return []
    }
  },

  /**
   * Fetch all classrooms in the college
   * Calls GET /api/coordinator/classrooms
   */
  async getClassrooms() {
    try {
      const response = await api.get('/coordinator/classrooms')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching classrooms:', err.message)
      return []
    }
  },

  /**
   * Create a new classroom
   * Calls POST /api/coordinator/classrooms
   */
  async createClassroom(classroomData) {
    const response = await api.post('/coordinator/classrooms', classroomData)
    return response.data?.data || response.data
  },

  /**
   * Delete a classroom
   * Calls DELETE /api/coordinator/classrooms/{id}
   */
  async deleteClassroom(classroomId) {
    const response = await api.delete(`/coordinator/classrooms/${classroomId}`)
    return response.data?.data || response.data
  },

  /**
   * Enroll a single student
   * Calls POST /api/coordinator/students
   */
  async createStudent(studentData) {
    const response = await api.post('/coordinator/students', studentData)
    return response.data?.data || response.data
  },

  /**
   * Onboard a single teacher
   * Calls POST /api/coordinator/teachers
   */
  async createTeacher(teacherData) {
    const response = await api.post('/coordinator/teachers', teacherData)
    return response.data?.data || response.data
  },

  /**
   * Preview Excel file for student batch import
   * Calls POST /api/coordinator/import/students/preview (Multipart)
   */
  async previewStudentExcel(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/coordinator/import/students/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data?.data || response.data
  },

  /**
   * Confirm and commit batch student import
   * Calls PUT /api/coordinator/import/students/confirm
   */
  async confirmStudentExcel(importRequest) {
    const response = await api.put('/coordinator/import/students/confirm', importRequest)
    return response.data?.data || response.data
  },

  /**
   * Preview Excel file for teacher batch import
   * Calls POST /api/coordinator/import/teachers/preview (Multipart)
   */
  async previewTeacherExcel(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/coordinator/import/teachers/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data?.data || response.data
  },

  /**
   * Confirm and commit batch teacher import
   * Calls PUT /api/coordinator/import/teachers/confirm
   */
  async confirmTeacherExcel(importRequest) {
    const response = await api.put('/coordinator/import/teachers/confirm', importRequest)
    return response.data?.data || response.data
  },

  /**
   * Resend credentials to a student or teacher via email
   * Calls POST /api/coordinator/users/{id}/resend-credentials
   */
  async resendCredentials(userId) {
    const response = await api.post(`/coordinator/users/${userId}/resend-credentials`)
    return response.data?.data || response.data
  }
}

export default coordinatorService
