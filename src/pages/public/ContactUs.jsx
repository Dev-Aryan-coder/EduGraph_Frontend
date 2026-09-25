import React, { useState } from 'react'
import './ContactUs.css'

export default function ContactUs({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    role: 'professor',
    interest: 'pilot',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulated submission with instant user feedback
    setIsSubmitted(true)
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const faqs = [
    {
      q: 'How fast can EduGraph be deployed across our institution?',
      a: 'A typical departmental rollout takes 7 to 10 days. Campus-wide deployments with SAML/Okta Single Sign-On and Canvas/Moodle LTI 1.3 integrations are typically completed within 3 to 4 weeks under our dedicated onboarding team.'
    },
    {
      q: 'How does the anti-cheat proctoring protect student privacy?',
      a: 'EduGraph uses non-invasive browser Page Visibility and Window Focus APIs. We do NOT install rootkits, scan local file systems, or record keystrokes. We focus strictly on academic focus telemetry during active whiteboard submissions.'
    },
    {
      q: 'Does EduGraph connect directly to our LMS gradebook?',
      a: 'Yes. EduGraph is 100% LTI 1.3 Advantage certified. Scores from post-submission 20-MCQ quizzes automatically cascade into Canvas, Blackboard, Moodle, and Brightspace gradebooks in real time.'
    },
    {
      q: 'Can an individual department run a pilot before full college adoption?',
      a: 'Absolutely. We offer a 30-day Department Pilot Package that allows up to 5 professors and 250 students to experience the full Edudraw canvas and validation suite with zero long-term commitment.'
    },
    {
      q: 'What hardware is required for students to use the whiteboard?',
      a: 'EduGraph is completely web-based and runs smoothly on standard modern browsers (Chrome, Firefox, Safari, Edge) across laptops, desktop PCs, iPads, and Chromebooks without requiring any software installation.'
    }
  ]

  return (
    <div className="contact-page-wrapper">
      
      {/* 1. Hero Section */}
      <section className="contact-hero-section">
        <div className="contact-hero-container">
          <div className="contact-badge-pill">
            <span className="contact-badge-dot" />
            <span>ACADEMIC PARTNERSHIPS & INQUIRIES</span>
          </div>

          <h1 className="contact-headline">
            Let's Transform Learning <br className="hidden-mobile" />
            <span className="contact-gradient-text">Across Your Institution</span>
          </h1>

          <div className="contact-sketch-divider" aria-hidden="true" />

          <p className="contact-subheadline">
            Have questions regarding campus licensing, LMS integration, or scheduling a technical walkthrough? Our academic solutions directors typically respond within 4 business hours.
          </p>
        </div>
      </section>

      {/* 2. Main 2-Column Contact Form & Direct Information */}
      <section className="contact-main-section">
        <div className="contact-content-container">
          <div className="contact-layout-grid">
            
            {/* Left Column: Interactive Form */}
            <div className="contact-form-card">
              <div className="form-card-header">
                <h3 className="form-title">Request Campus Briefing & Demo</h3>
                <span className="form-sla-pill">⚡ 4-Hour Response SLA</span>
              </div>

              {isSubmitted ? (
                <div className="form-success-message">
                  <div className="success-icon">✓</div>
                  <h4>Inquiry Successfully Received</h4>
                  <p>
                    Thank you, <strong>{formData.fullName}</strong>. An academic director will contact you at <strong>{formData.email}</strong> shortly with your personalized campus walkthrough link.
                  </p>
                  <button 
                    className="reset-form-btn"
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({
                        fullName: '',
                        email: '',
                        institution: '',
                        role: 'professor',
                        interest: 'pilot',
                        message: ''
                      })
                    }}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form className="contact-form-body" onSubmit={handleSubmit}>
                  <div className="form-row-dual">
                    <div className="form-field-group">
                      <label className="form-label" htmlFor="fullName">Full Name *</label>
                      <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        className="form-input" 
                        placeholder="Dr. Eleanor Vance" 
                        required 
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="form-label" htmlFor="email">Academic Email *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="form-input" 
                        placeholder="evance@university.edu" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row-dual">
                    <div className="form-field-group">
                      <label className="form-label" htmlFor="institution">Institution / College Name *</label>
                      <input 
                        type="text" 
                        id="institution" 
                        name="institution" 
                        className="form-input" 
                        placeholder="State University of Technology" 
                        required 
                        value={formData.institution}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="form-label" htmlFor="role">Your Academic Role</label>
                      <select 
                        id="role" 
                        name="role" 
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="principal">Dean / College Principal</option>
                        <option value="dept-head">Department Head / Chair</option>
                        <option value="professor">Professor / Lecturer</option>
                        <option value="it-admin">IT / LMS Administrator</option>
                        <option value="student">Student Representative</option>
                        <option value="other">Other Academic Stakeholder</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" htmlFor="interest">Area of Interest</label>
                    <select 
                      id="interest" 
                      name="interest" 
                      className="form-select"
                      value={formData.interest}
                      onChange={handleChange}
                    >
                      <option value="pilot">Department Pilot Program (30 Days)</option>
                      <option value="enterprise">Campus-Wide Enterprise Licensing</option>
                      <option value="lms">LTI 1.3 LMS Integration (Canvas / Moodle)</option>
                      <option value="security">Security & Anti-Cheat Review</option>
                      <option value="general">General Inquiries & Pricing</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" htmlFor="message">Message & Requirements</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="4" 
                      className="form-textarea" 
                      placeholder="Tell us about your department size, estimated student cohorts, or specific whiteboard courses..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="form-submit-btn">
                    <span>Submit Institutional Request</span>
                    <span className="submit-arrow">➔</span>
                  </button>

                  <span className="form-privacy-note">
                    🔒 We protect academic privacy. Your information is never shared or monetized.
                  </span>
                </form>
              )}
            </div>

            {/* Right Column: Direct Channels & Campus Hubs */}
            <div className="contact-info-col">
              
              <div className="contact-info-card">
                <span className="info-card-badge">DIRECT CHANNELS</span>
                <h3 className="info-card-title">Connect Directly</h3>

                <div className="direct-item">
                  <span className="direct-icon">✉️</span>
                  <div>
                    <span className="direct-label">Academic Partnerships</span>
                    <a href="mailto:partnerships@edugraph.edu" className="direct-val">partnerships@edugraph.edu</a>
                  </div>
                </div>

                <div className="direct-item">
                  <span className="direct-icon">📞</span>
                  <div>
                    <span className="direct-label">Institutional Hotline</span>
                    <a href="tel:+18003384727" className="direct-val">+1 (800) EDU-GRAPH</a>
                  </div>
                </div>

                <div className="direct-item">
                  <span className="direct-icon">🛠️</span>
                  <div>
                    <span className="direct-label">Technical & Faculty Support</span>
                    <a href="mailto:support@edugraph.edu" className="direct-val">support@edugraph.edu</a>
                  </div>
                </div>
              </div>

              <div className="contact-info-card">
                <span className="info-card-badge">CAMPUS HUBS</span>
                <h3 className="info-card-title">Global Academic Hubs</h3>

                <div className="hub-item">
                  <strong>Silicon Valley Office</strong>
                  <p>740 Campus Drive, Palo Alto, CA 94304</p>
                </div>

                <div className="hub-item">
                  <strong>Boston Education District</strong>
                  <p>100 Cambridge St, Suite 1400, Boston, MA 02114</p>
                </div>

                <div className="hub-item">
                  <strong>London Academic Center</strong>
                  <p>25 High Holborn, London WC1V 6AZ, UK</p>
                </div>
              </div>

              <div className="system-health-card">
                <div className="health-dot" />
                <div className="health-info">
                  <strong>All Systems Operational</strong>
                  <span>99.99% SLA • Real-Time Engine Active</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Frequently Asked Questions Accordion */}
      <section className="contact-faq-section">
        <div className="contact-content-container">
          <div className="faq-header-block">
            <span className="section-eyebrow">COMMON QUESTIONS</span>
            <h2 className="faq-section-title">Frequently Asked Questions</h2>
            <p className="faq-section-desc">
              Answers to common inquiries regarding implementation, proctoring privacy, and campus licensing.
            </p>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-item ${activeFaq === idx ? 'open' : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question-row">
                  <h4 className="faq-q-text">{faq.q}</h4>
                  <span className="faq-toggle-icon">{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <div className="faq-answer-row">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}