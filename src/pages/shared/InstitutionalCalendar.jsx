import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import sharedService from '../../services/sharedService'
import {
  IconCalendar,
  IconPlus,
  IconArrowLeft,
  IconClock,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconTrash
} from '../../components/common/Icons'
import './InstitutionalCalendar.css'

export default function InstitutionalCalendar({ onBack }) {
  const [currentUser] = useState(() => authService.getStoredUser())
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  // New Event Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventType, setEventType] = useState('ACADEMIC')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const collegeId = currentUser?.collegeId || 1

  useEffect(() => {
    loadEvents()
  }, [collegeId])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const data = await sharedService.getCalendarEvents(collegeId)
      setEvents(data || [])
    } catch (err) {
      console.error('Error fetching calendar events:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const role = (currentUser?.role || '').toUpperCase()
  const canManage = ['ADMIN', 'ROLE_ADMIN', 'PRINCIPAL', 'ROLE_PRINCIPAL', 'COORDINATOR', 'ROLE_COORDINATOR'].includes(role)


  const handleCreateEvent = async (e) => {
    e.preventDefault()
    if (!eventTitle.trim() || !eventDate) return

    setIsSubmitting(true)
    setErrorMessage('')
    try {
      await sharedService.createCalendarEvent({
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        eventDate: new Date(eventDate).toISOString(),
        eventType
      })
      setIsModalOpen(false)
      setEventTitle('')
      setEventDescription('')
      setEventDate('')
      loadEvents()
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to create calendar event.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to remove this calendar event?')) return
    try {
      await sharedService.deleteCalendarEvent(id)
      loadEvents()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event.')
    }
  }

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  // Days calculation for calendar grid
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const daysArray = []
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i)
  }

  // Filter events for this month
  const thisMonthEvents = events.filter(e => {
    if (!e.eventDate) return false
    const d = new Date(e.eventDate)
    return d.getMonth() === month && d.getFullYear() === year
  })

  return (
    <div className="calendar-root">
      {/* Top Header */}
      <header className="calendar-header">
        <div className="calendar-header-left">
          {onBack && (
            <button className="calendar-back-btn" onClick={onBack}>
              <IconArrowLeft size={16} /> Back
            </button>
          )}
          <div className="calendar-title-wrap">
            <h2>Institutional Academic Calendar</h2>
            <p>Schedules, examination timetables, holiday list, and semester milestones</p>
          </div>
        </div>

        {canManage && (
          <div className="calendar-header-right">
            <button className="btn-add-event" onClick={() => setIsModalOpen(true)}>
              <IconPlus size={16} /> Schedule Event
            </button>
          </div>
        )}
      </header>

      {/* Main Grid Layout */}
      <div className="calendar-content-container">
        {/* Calendar Grid View */}
        <div className="calendar-main-card">
          <div className="calendar-month-controls">
            <button className="btn-month-nav" onClick={prevMonth}>← Previous</button>
            <h3>{monthName}</h3>
            <button className="btn-month-nav" onClick={nextMonth}>Next →</button>
          </div>

          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="weekday-cell">{d}</div>
            ))}
          </div>

          <div className="calendar-days-grid">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="day-cell empty" />
              }

              // Check if any events fall on this day
              const dayEvents = thisMonthEvents.filter(e => {
                const ed = new Date(e.eventDate)
                return ed.getDate() === day
              })

              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year

              return (
                <div key={day} className={`day-cell ${isToday ? 'today' : ''}`}>
                  <span className="day-number">{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="day-events-list">
                      {dayEvents.slice(0, 2).map(de => (
                        <div key={de.id} className={`day-event-pill type-${(de.eventType || 'ACADEMIC').toLowerCase()}`}>
                          {de.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="more-events">+{dayEvents.length - 2} more</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Events List Sidebar */}
        <div className="calendar-upcoming-card">
          <h3>Upcoming Institutional Events ({thisMonthEvents.length})</h3>

          {isLoading ? (
            <div className="cal-loading">
              <div className="quiz-spinner" />
              <p>Loading schedule...</p>
            </div>
          ) : thisMonthEvents.length === 0 ? (
            <div className="cal-empty">
              <IconCalendar size={36} color="#94A3B8" />
              <p>No events scheduled for this month.</p>
            </div>
          ) : (
            <div className="events-stream">
              {thisMonthEvents.map(e => (
                <div key={e.id} className="event-item-card">
                  <div className="event-date-box">
                    <span className="ev-month">
                      {new Date(e.eventDate).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="ev-day">{new Date(e.eventDate).getDate()}</span>
                  </div>

                  <div className="event-details">
                    <div className="event-type-badge">
                      {e.eventType || 'ACADEMIC'}
                    </div>
                    <h4>{e.title}</h4>
                    {e.description && <p>{e.description}</p>}
                  </div>

                  {canManage && (
                    <button
                      className="btn-delete-ev"
                      onClick={() => handleDeleteEvent(e.id)}
                      title="Delete Event"
                    >
                      <IconTrash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="cal-modal-card">
            <div className="modal-header">
              <h3>Schedule Institutional Event</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <IconX size={18} />
              </button>
            </div>

            {errorMessage && (
              <div className="cal-modal-alert">
                <IconAlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="cal-modal-form">
              <div className="form-group">
                <label>Event Type *</label>
                <select
                  className="cal-input"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value="ACADEMIC">Academic Schedule</option>
                  <option value="EXAMINATION">Examinations & Tests</option>
                  <option value="HOLIDAY">Public / College Holiday</option>
                  <option value="CULTURAL">Cultural & Sports Festival</option>
                  <option value="SEMINAR">Workshop / Seminar</option>
                </select>
              </div>

              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  className="cal-input"
                  placeholder="e.g. End Semester Theory Examination"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Date & Time *</label>
                <input
                  type="datetime-local"
                  className="cal-input"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description / Guidelines</label>
                <textarea
                  className="cal-textarea"
                  placeholder="Additional details for faculty and students..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Scheduling...' : (
                    <>
                      <IconCheck size={16} /> Save Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}