/**
 * assignmentLockService.js
 * 
 * Manages assignment locking when students accidentally exit before submission,
 * generation of unlock support tickets to the course teacher,
 * and teacher resolution to unlock and permit assignment re-attempts.
 */

import sharedService from './sharedService'

const LOCKS_STORAGE_KEY = 'edugraph_assignment_locks'
const UNLOCK_TICKETS_STORAGE_KEY = 'edugraph_assignment_unlock_tickets'

export const assignmentLockService = {
  // ================= STORAGE HELPERS =================

  _getLocks() {
    try {
      const data = localStorage.getItem(LOCKS_STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (e) {
      console.error('Failed to read assignment locks from storage:', e)
      return []
    }
  },

  _saveLocks(locks) {
    try {
      localStorage.setItem(LOCKS_STORAGE_KEY, JSON.stringify(locks))
      window.dispatchEvent(new Event('edugraph_assignment_lock_change'))
    } catch (e) {
      console.error('Failed to save assignment locks to storage:', e)
    }
  },

  _getTickets() {
    try {
      const data = localStorage.getItem(UNLOCK_TICKETS_STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (e) {
      console.error('Failed to read unlock tickets from storage:', e)
      return []
    }
  },

  _saveTickets(tickets) {
    try {
      localStorage.setItem(UNLOCK_TICKETS_STORAGE_KEY, JSON.stringify(tickets))
      window.dispatchEvent(new Event('edugraph_assignment_tickets_change'))
    } catch (e) {
      console.error('Failed to save unlock tickets to storage:', e)
    }
  },

  // ================= LOCK OPERATIONS =================

  /**
   * Locks an assignment for a student upon accidental exit.
   */
  lockAssignment(studentUser, assignment, exitReason = 'Accidental exit before final submission') {
    if (!studentUser || !assignment) return null

    const studentId = studentUser.id || 'current_student'
    const studentName = studentUser.fullName || studentUser.name || 'Student'
    const studentRollNumber = studentUser.rollNumber || studentUser.studentId || 'N/A'
    const assignmentId = assignment.id
    const assignmentTitle = assignment.title || 'Coursework Assignment'

    const locks = this._getLocks()
    const existingIndex = locks.findIndex(
      l => String(l.studentId) === String(studentId) && String(l.assignmentId) === String(assignmentId)
    )

    const lockRecord = {
      id: `LOCK-${Date.now()}-${assignmentId}`,
      studentId,
      studentName,
      studentRollNumber,
      assignmentId,
      assignmentTitle,
      subject: assignment.subject || 'Coursework',
      classroomId: assignment.classroomId || null,
      lockedAt: new Date().toISOString(),
      exitReason,
      isLocked: true,
      ticketId: null,
      ticketStatus: null, // 'PENDING' | 'RESOLVED'
      wasUnlocked: false,
      unlockedAt: null,
      unlockedBy: null
    }

    if (existingIndex >= 0) {
      // Preserve ticket ID if existing
      lockRecord.ticketId = locks[existingIndex].ticketId
      lockRecord.ticketStatus = locks[existingIndex].ticketStatus
      locks[existingIndex] = lockRecord
    } else {
      locks.push(lockRecord)
    }

    this._saveLocks(locks)
    return lockRecord
  },

  /**
   * Checks if an assignment is currently locked for a student.
   */
  isAssignmentLocked(studentId, assignmentId) {
    if (!studentId || !assignmentId) return false
    const locks = this._getLocks()
    const record = locks.find(
      l => String(l.studentId) === String(studentId) && String(l.assignmentId) === String(assignmentId)
    )
    return !!(record && record.isLocked)
  },

  /**
   * Gets the lock record for a student & assignment.
   */
  getLock(studentId, assignmentId) {
    if (!studentId || !assignmentId) return null
    const locks = this._getLocks()
    return locks.find(
      l => String(l.studentId) === String(studentId) && String(l.assignmentId) === String(assignmentId)
    ) || null
  },

  /**
   * Gets all active locks for a student.
   */
  getStudentLocks(studentId) {
    if (!studentId) return []
    const locks = this._getLocks()
    return locks.filter(l => String(l.studentId) === String(studentId) && l.isLocked)
  },

  // ================= TICKET OPERATIONS =================

  /**
   * Raises an unlock ticket to the teacher for a locked assignment.
   */
  async raiseUnlockTicket(studentUser, assignment, explanation = '') {
    if (!studentUser || !assignment) return null

    const studentId = studentUser.id || 'current_student'
    const studentName = studentUser.fullName || studentUser.name || 'Student'
    const studentRollNumber = studentUser.rollNumber || studentUser.studentId || 'N/A'
    const assignmentId = assignment.id
    const assignmentTitle = assignment.title || 'Coursework Assignment'

    const ticketId = `TICK-UNLOCK-${Date.now().toString().slice(-6)}`
    const defaultDesc = explanation || 'I accidentally exited back to the dashboard while working on the assignment. Please unlock it so I can re-attempt.'

    const ticketRecord = {
      id: ticketId,
      category: 'ASSIGNMENT_UNLOCK',
      targetRole: 'TEACHER',
      title: `Assignment Unlock Request: ${assignmentTitle}`,
      subject: `Assignment Unlock Request: ${assignmentTitle}`,
      description: defaultDesc,
      assignmentId,
      assignmentTitle,
      subjectName: assignment.subject || 'Coursework',
      classroomId: assignment.classroomId || null,
      studentId,
      studentName,
      studentRollNumber,
      status: 'PENDING', // 'PENDING' | 'RESOLVED'
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      resolutionNotes: null,
      resolvedBy: null
    }

    // Save to local tickets store
    const tickets = this._getTickets()
    tickets.unshift(ticketRecord)
    this._saveTickets(tickets)

    // Update the lock record
    const locks = this._getLocks()
    const lock = locks.find(
      l => String(l.studentId) === String(studentId) && String(l.assignmentId) === String(assignmentId)
    )
    if (lock) {
      lock.ticketId = ticketId
      lock.ticketStatus = 'PENDING'
      this._saveLocks(locks)
    }

    // Try posting to backend API as well
    try {
      await sharedService.createTicket({
        title: ticketRecord.title,
        subject: ticketRecord.subject,
        description: `${defaultDesc} (Student: ${studentName}, Roll: ${studentRollNumber}, Assignment ID: ${assignmentId})`,
        category: 'PERMISSION_OVERRIDE',
        targetRole: 'TEACHER',
        classroomId: assignment.classroomId || null
      })
    } catch (err) {
      console.warn('Backend ticket API failed, local ticket store updated:', err.message)
    }

    return ticketRecord
  },

  /**
   * Retrieves all unlock tickets, optionally filtered for a teacher or assignment.
   */
  getUnlockTickets({ teacherId, assignmentId, classroomId } = {}) {
    let list = this._getTickets()
    if (assignmentId) {
      list = list.filter(t => String(t.assignmentId) === String(assignmentId))
    }
    if (classroomId) {
      list = list.filter(t => String(t.classroomId) === String(classroomId))
    }
    return list
  },

  /**
   * Teacher action: Unlocks the assignment for the student and resolves the ticket.
   */
  unlockAssignment(ticketId, resolutionNotes = 'Assignment unlocked by teacher. Re-attempt permitted.', teacherUser = null) {
    const tickets = this._getTickets()
    const ticketIndex = tickets.findIndex(t => t.id === ticketId)
    if (ticketIndex === -1) {
      // If ticketId is not found, try matching by string or look for pending ticket
      return { success: false, message: 'Ticket not found.' }
    }

    const ticket = tickets[ticketIndex]
    const teacherName = teacherUser?.fullName || teacherUser?.name || 'Course Instructor'

    ticket.status = 'RESOLVED'
    ticket.resolvedAt = new Date().toISOString()
    ticket.resolutionNotes = resolutionNotes
    ticket.resolvedBy = teacherName
    tickets[ticketIndex] = ticket
    this._saveTickets(tickets)

    // Clear the lock for this student and assignment
    const locks = this._getLocks()
    const lockIndex = locks.findIndex(
      l => String(l.studentId) === String(ticket.studentId) && String(l.assignmentId) === String(ticket.assignmentId)
    )

    if (lockIndex >= 0) {
      locks[lockIndex].isLocked = false
      locks[lockIndex].wasUnlocked = true
      locks[lockIndex].ticketStatus = 'RESOLVED'
      locks[lockIndex].unlockedAt = new Date().toISOString()
      locks[lockIndex].unlockedBy = teacherName
      this._saveLocks(locks)
    }

    return {
      success: true,
      ticket,
      studentName: ticket.studentName,
      assignmentTitle: ticket.assignmentTitle
    }
  },

  /**
   * Dismisses the "unlocked" celebratory notification for the student.
   */
  dismissUnlockedNotification(studentId, assignmentId) {
    const locks = this._getLocks()
    const lock = locks.find(
      l => String(l.studentId) === String(studentId) && String(l.assignmentId) === String(assignmentId)
    )
    if (lock) {
      lock.wasUnlocked = false
      this._saveLocks(locks)
    }
  }
}

export default assignmentLockService
