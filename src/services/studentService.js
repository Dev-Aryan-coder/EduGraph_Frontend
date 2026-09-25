import api from './api'

export const studentService = {
  // ================= ASSIGNMENTS =================

  /**
   * Fetch all assignments published for the student's enrolled classroom
   * GET /api/assignments/student/my-assignments
   */
  async getMyAssignments() {
    try {
      const response = await api.get('/assignments/student/my-assignments')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching student assignments:', err.message)
      return []
    }
  },

  /**
   * Fetch details for a specific assignment
   * GET /api/assignments/{id}
   */
  async getAssignmentById(id) {
    const response = await api.get(`/assignments/${id}`)
    return response.data?.data || response.data
  },

  // ================= SUBMISSIONS & PROCTORING =================

  /**
   * Fetch the current student's submission status for an assignment
   * GET /api/submissions/assignment/{assignmentId}/my-submission
   */
  async getMySubmission(assignmentId) {
    try {
      const response = await api.get(`/submissions/assignment/${assignmentId}/my-submission`)
      return response.data?.data || response.data || null
    } catch (err) {
      // 404 means student hasn't started/drafted yet
      return null
    }
  },

  /**
   * Auto-save or draft whiteboard canvas work
   * POST /api/submissions/assignment/{assignmentId}/draft
   */
  async saveDrawingDraft(assignmentId, drawingData) {
    const response = await api.post(`/submissions/assignment/${assignmentId}/draft`, {
      excalidrawDrawingData: typeof drawingData === 'string' ? drawingData : JSON.stringify(drawingData)
    })
    return response.data?.data || response.data
  },

  /**
   * Finalize and permanently submit whiteboard canvas solution
   * POST /api/submissions/assignment/{assignmentId}/finalize
   */
  async finalizeSubmission(assignmentId, drawingData) {
    const response = await api.post(`/submissions/assignment/${assignmentId}/finalize`, {
      excalidrawDrawingData: typeof drawingData === 'string' ? drawingData : JSON.stringify(drawingData)
    })
    return response.data?.data || response.data
  },

  /**
   * Record a tab-switch event during proctoring
   * POST /api/submissions/assignment/{assignmentId}/tab-switch
   */
  async recordTabSwitch(assignmentId, details = 'Student switched active browser tab') {
    try {
      const response = await api.post(`/submissions/assignment/${assignmentId}/tab-switch`, {
        timestamp: new Date().toISOString(),
        details
      })
      return response.data?.data || response.data
    } catch (err) {
      console.error('Error logging proctoring tab switch:', err.message)
      return null
    }
  },

  // ================= 20 MCQ VERIFICATION ASSESSMENT =================

  /**
   * Fetch the 20 MCQs for the assignment (student view - no correct answer keys)
   * GET /api/mcq/assignment/{assignmentId}/questions
   */
  async getMCQQuestions(assignmentId) {
    try {
      const response = await api.get(`/mcq/assignment/${assignmentId}/questions`)
      return response.data?.data || response.data || []
    } catch (err) {
      console.error(`Error fetching MCQs for assignment ${assignmentId}:`, err.message)
      return []
    }
  },

  /**
   * Submit student answers for the 20 MCQ verification assessment
   * POST /api/mcq/assignment/{assignmentId}/submit
   * @param {Array<{ questionId: number, selectedOption: string }>} answers
   */
  async submitMCQ(assignmentId, answers) {
    const response = await api.post(`/mcq/assignment/${assignmentId}/submit`, answers)
    return response.data?.data || response.data
  },

  /**
   * Fetch the student's result and score for the 20 MCQs
   * GET /api/mcq/assignment/{assignmentId}/my-result
   */
  async getMyMCQResult(assignmentId) {
    try {
      const response = await api.get(`/mcq/assignment/${assignmentId}/my-result`)
      return response.data?.data || response.data || null
    } catch (err) {
      return null
    }
  },

  // ================= SUBJECT WHITEBOARD PANELS =================

  /**
   * Get all subject panels created by the student
   * GET /api/panels
   */
  async getMyPanels() {
    try {
      const response = await api.get('/panels')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching subject panels:', err.message)
      return []
    }
  },

  /**
   * Create a new subject whiteboard panel
   * POST /api/panels
   */
  async createPanel(subjectName) {
    const response = await api.post('/panels', { subjectName })
    return response.data?.data || response.data
  },

  /**
   * Fetch a specific panel by ID
   * GET /api/panels/{id}
   */
  async getPanel(id) {
    const response = await api.get(`/panels/${id}`)
    return response.data?.data || response.data
  },

  /**
   * Update a subject panel
   * PUT /api/panels/{id}
   */
  async updatePanel(id, subjectName) {
    const response = await api.put(`/panels/${id}`, { subjectName })
    return response.data?.data || response.data
  },

  /**
   * Delete a subject panel
   * DELETE /api/panels/{id}
   */
  async deletePanel(id) {
    const response = await api.delete(`/panels/${id}`)
    return response.data?.data || response.data
  },

  // ================= TOPIC NODES (KNOWLEDGE GRAPH) =================

  /**
   * Get all topic nodes inside a panel
   * GET /api/panels/{panelId}/nodes
   */
  async getNodesForPanel(panelId) {
    try {
      const response = await api.get(`/panels/${panelId}/nodes`)
      return response.data?.data || response.data || []
    } catch (err) {
      console.error(`Error fetching nodes for panel ${panelId}:`, err.message)
      return []
    }
  },

  /**
   * Create a new topic node in a panel
   * POST /api/panels/{panelId}/nodes
   */
  async createNode(panelId, nodeData) {
    const response = await api.post(`/panels/${panelId}/nodes`, nodeData)
    return response.data?.data || response.data
  },

  /**
   * Get a single node by ID
   * GET /api/nodes/{id}
   */
  async getNode(id) {
    const response = await api.get(`/nodes/${id}`)
    return response.data?.data || response.data
  },

  /**
   * Update a topic node
   * PUT /api/nodes/{id}
   */
  async updateNode(id, nodeData) {
    const response = await api.put(`/nodes/${id}`, nodeData)
    return response.data?.data || response.data
  },

  /**
   * Delete a topic node
   * DELETE /api/nodes/{id}
   */
  async deleteNode(id) {
    const response = await api.delete(`/nodes/${id}`)
    return response.data?.data || response.data
  },

  // ================= NODE CONNECTIONS =================

  /**
   * Link two nodes together
   * POST /api/nodes/{id}/connections
   */
  async linkNodes(sourceNodeId, { targetNodeId, label }) {
    const response = await api.post(`/nodes/${sourceNodeId}/connections`, {
      targetNodeId: Number(targetNodeId),
      label
    })
    return response.data?.data || response.data
  },

  /**
   * Get all connections originating from a node
   * GET /api/nodes/{id}/connections
   */
  async getConnections(nodeId) {
    try {
      const response = await api.get(`/nodes/${nodeId}/connections`)
      return response.data?.data || response.data || []
    } catch (err) {
      console.error(`Error fetching connections for node ${nodeId}:`, err.message)
      return []
    }
  },

  /**
   * Unlink a connection
   * DELETE /api/nodes/{id}/connections/{connId}
   */
  async unlinkNodes(nodeId, connId) {
    const response = await api.delete(`/nodes/${nodeId}/connections/${connId}`)
    return response.data?.data || response.data
  },

  // ================= COLLABORATION & SHARING =================

  /**
   * Share a topic node with another student (view-only)
   * POST /api/nodes/{id}/share
   */
  async shareNode(nodeId, recipientEmail) {
    const response = await api.post(`/nodes/${nodeId}/share`, { recipientEmail })
    return response.data?.data || response.data
  },

  /**
   * Share an entire subject panel with another student
   * POST /api/panels/{id}/share
   */
  async sharePanel(panelId, recipientEmail) {
    const response = await api.post(`/panels/${panelId}/share`, { recipientEmail })
    return response.data?.data || response.data
  },

  /**
   * Get all nodes and panels shared with the student by peers
   * GET /api/nodes/shared-with-me
   */
  async getSharedWithMe() {
    try {
      const response = await api.get('/nodes/shared-with-me')
      return response.data?.data || response.data || []
    } catch (err) {
      console.error('Error fetching shared items:', err.message)
      return []
    }
  },

  /**
   * Revoke shared access
   * DELETE /api/nodes/{id}/share/{shareId}
   */
  async revokeShare(nodeId, shareId) {
    const response = await api.delete(`/nodes/${nodeId}/share/${shareId}`)
    return response.data?.data || response.data
  },

  // ================= NOTICES FEED =================
  async getNotices() {
    try {
      const response = await api.get('/notices/my-feed')
      return response.data?.data || response.data || []
    } catch {
      return []
    }
  },

  async getMyNotices() {
    try {
      const response = await api.get('/notices/my-feed')
      return response.data?.data || response.data || []
    } catch {
      return []
    }
  }
}

export default studentService
