import React, { useState } from 'react'
import './Features.css'

export default function Features({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const navigateTo = (tab) => {
    if (onNavigate) {
      onNavigate(tab)
    } else {
      window.location.hash = `#${tab}`
    }
  }

  const featureCards = [
    {
      id: 'edudraw',
      category: 'canvas',
      tag: 'CANVAS STUDIO',
      title: 'Edudraw Interactive Whiteboard',
      badge: 'Core Engine',
      desc: 'An ultra-low latency, vector-based whiteboard studio allowing students to draw, link concepts, connect formulas, and annotate proofs in real time.',
      icon: '✏️',
      highlights: ['Infinite panning & zooming', 'LaTeX equation rendering', 'Hand-drawn aesthetic connectors', 'Auto-saving node topology'],
      metric: '0.04s Canvas Latency'
    },
    {
      id: 'proctor',
      category: 'security',
      tag: 'ANTI-CHEAT SYSTEM',
      title: 'Real-Time Page Visibility Proctor',
      badge: 'Zero-Cheating',
      desc: 'Continuous browser focus monitoring detects unauthorized tab switches, background window blurring, and external copy-paste attempts.',
      icon: '🛡️',
      highlights: ['Tab switch telemetry log', 'Focus loss counter', 'Non-intrusive privacy model', 'Instant alert to instructor'],
      metric: '99.4% Verified Integrity'
    },
    {
      id: 'quiz',
      category: 'evaluation',
      tag: 'VALIDATION ENGINE',
      title: 'Post-Submission 20-MCQ Quiz',
      badge: 'Automated Scoring',
      desc: 'Immediately following whiteboard submission, students must answer 20 rapid-fire concept questions verifying genuine intellectual ownership.',
      icon: '🎯',
      highlights: ['Auto-scored in < 0.2s', 'Node-specific comprehension checks', 'Verified grade report generation', 'Halts ghost submissions'],
      metric: '100% Personal Authorship'
    },
    {
      id: 'topology',
      category: 'canvas',
      tag: 'SPATIAL COGNITION',
      title: 'Bidirectional Concept Topology',
      badge: 'Dual-Coding',
      desc: 'Replace fragile linear memorization with structural relational graphs. Interconnect lectures, equations, and lab records across disciplines.',
      icon: '🧠',
      highlights: ['Graph-based relational logic', 'Prerequisite concept tracking', 'Multi-disciplinary bridges', 'Cognitive retention anchor'],
      metric: '+3.8x Enduring Retention'
    },
    {
      id: 'dashboard',
      category: 'analytics',
      tag: 'FACULTY & LEADERSHIP',
      title: 'Principal & Faculty Telemetry',
      badge: 'Institutional Scale',
      desc: 'Real-time cohort comprehension heatmaps allow deans and educators to pinpoint knowledge gaps long before midterm exams.',
      icon: '📊',
      highlights: ['Classroom bottleneck heatmaps', 'Automated gradebook exports', 'Student struggle flags', 'Accreditation audit logs'],
      metric: '250+ Campuses Onboard'
    },
    {
      id: 'cryptographic',
      category: 'security',
      tag: 'TAMPER-PROOF AUDIT',
      title: 'Cryptographic Grade Verification',
      badge: 'SHA-256 Hashed',
      desc: 'Every whiteboard canvas submission and quiz response is timestamped and cryptographically sealed, creating an immutable audit trail.',
      icon: '🔒',
      highlights: ['SHA-256 state hashing', 'Time-stamped audit dossier', 'Tamper-evident grade records', 'FERPA & GDPR compliant'],
      metric: '0% Plagiarism Tolerance'
    }
  ]

  const filteredFeatures = activeCategory === 'all' 
    ? featureCards 
    : featureCards.filter(f => f.category === activeCategory)

  return (
    <div className="features-page-wrapper">
      
      {/* 1. Hero Section */}
      <section className="features-hero-section">
        <div className="features-hero-container">
          <div className="features-badge-pill">
            <span className="features-badge-dot" />
            <span>PLATFORM CAPABILITIES & ARCHITECTURE</span>
          </div>

          <h1 className="features-headline">
            Engineered for <span className="features-gradient-text">Cognitive Depth</span> <br className="hidden-mobile" />
            & Tamper-Proof Verification
          </h1>

          <div className="features-sketch-divider" aria-hidden="true" />

          <p className="features-subheadline">
            EduGraph unifies an architectural whiteboard canvas, live anti-cheat proctoring, and instant concept validation into a single, high-performance academic environment.
          </p>

          {/* Interactive Filter Pills */}
          <div className="features-filter-row">
            <button 
              className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Capabilities (6)
            </button>
            <button 
              className={`filter-pill ${activeCategory === 'canvas' ? 'active' : ''}`}
              onClick={() => setActiveCategory('canvas')}
            >
              ✏️ Edudraw Canvas
            </button>
            <button 
              className={`filter-pill ${activeCategory === 'security' ? 'active' : ''}`}
              onClick={() => setActiveCategory('security')}
            >
              🛡️ Anti-Cheat Proctoring
            </button>
            <button 
              className={`filter-pill ${activeCategory === 'evaluation' ? 'active' : ''}`}
              onClick={() => setActiveCategory('evaluation')}
            >
              🎯 20-MCQ Validation
            </button>
            <button 
              className={`filter-pill ${activeCategory === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveCategory('analytics')}
            >
              📊 Telemetry & Analytics
            </button>
          </div>
        </div>
      </section>

      {/* 2. Interactive Feature Deep Dive Grid */}
      <section className="features-grid-section">
        <div className="features-content-container">
          <div className="features-cards-grid">
            {filteredFeatures.map((card) => (
              <div key={card.id} className="feature-card-item">
                <div className="feat-card-top">
                  <div className="feat-icon-badge">{card.icon}</div>
                  <span className="feat-pill-tag">{card.badge}</span>
                </div>
                
                <span className="feat-category-eyebrow">{card.tag}</span>
                <h3 className="feat-card-title">{card.title}</h3>
                <p className="feat-card-desc">{card.desc}</p>

                <div className="feat-checklist-box">
                  {card.highlights.map((item, idx) => (
                    <div key={idx} className="feat-check-item">
                      <span className="feat-check-icon">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="feat-card-footer">
                  <span className="feat-metric-val">{card.metric}</span>
                  <span className="feat-arrow-link">Explore Spec ➔</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Deep-Dive Whiteboard Architecture Demo */}
      <section className="features-whiteboard-demo-section">
        <div className="features-content-container">
          <div className="feat-section-header">
            <span className="section-eyebrow">DEEP-DIVE ARCHITECTURE</span>
            <h2 className="feat-section-title">The Edudraw Verified Canvas Studio</h2>
            <p className="feat-section-desc">
              Inside the student experience: combining freeform sketching with structured semantic nodes.
            </p>
          </div>

          <div className="demo-canvas-card">
            <div className="demo-canvas-header">
              <div className="canvas-dots">
                <span className="dot dot-red" />
                <span className="dot dot-amber" />
                <span className="dot dot-green" />
              </div>
              <div className="demo-canvas-title">
                <span>Physics 301 • Electromagnetism Topology Board</span>
                <span className="demo-status-pill">● Session Live</span>
              </div>
              <div className="demo-canvas-tools">
                <span className="tool-btn active">✏️ Draw</span>
                <span className="tool-btn">▢ Node</span>
                <span className="tool-btn">⇄ Arrow</span>
                <span className="tool-btn">🛡️ Proctored</span>
              </div>
            </div>

            <div className="demo-canvas-body">
              <div className="demo-node-cluster">
                <div className="demo-node demo-node-main">
                  <span className="node-code">PHY-CORE</span>
                  <h4>Maxwell's 4 Equations</h4>
                  <p>Unified Electrodynamics Field</p>
                </div>
                
                <div className="demo-connector-horizontal">
                  <span className="connector-text">Bi-directional Coupling ➔</span>
                </div>

                <div className="demo-node demo-node-sub">
                  <span className="node-code">DERIVATION</span>
                  <h4>Electromagnetic Wave Speed</h4>
                  <p>c = 1 / √(μ₀ε₀)</p>
                </div>
              </div>

              <div className="demo-sticky-box">
                <span className="sticky-pin">📌</span>
                <span>Proctor Active: 0 tab switches • Focus retention 100%</span>
              </div>

              <div className="demo-canvas-footer-bar">
                <div className="footer-bar-left">
                  <span>● 16 Node Vertices</span>
                  <span>• 24 Relational Edges</span>
                  <span>• Autosaved to Cloud</span>
                </div>
                <div className="footer-bar-right">
                  <span className="quiz-ready-pill">🎯 20-MCQ Validation Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table: EduGraph vs Traditional Systems */}
      <section className="features-comparison-section">
        <div className="features-content-container">
          <div className="feat-section-header">
            <span className="section-eyebrow">COMPETITIVE BENCHMARK</span>
            <h2 className="feat-section-title">How EduGraph Compares</h2>
            <p className="feat-section-desc">
              Why leading institutions choose EduGraph over generic whiteboards and legacy LMS platforms.
            </p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="th-feature">Capability</th>
                  <th className="th-edugraph">EduGraph Platform</th>
                  <th className="th-other">Generic Whiteboards</th>
                  <th className="th-other">Traditional LMS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="td-feature-name">
                    <strong>Visual Mind Graphing</strong>
                    <span>Interactive concept mapping</span>
                  </td>
                  <td className="td-edugraph">✓ Built-in Edudraw</td>
                  <td className="td-other">✓ Basic Canvas</td>
                  <td className="td-other">✕ Flat Text Only</td>
                </tr>
                <tr>
                  <td className="td-feature-name">
                    <strong>Live Page Anti-Cheat Shield</strong>
                    <span>Tab switch detection & focus tracking</span>
                  </td>
                  <td className="td-edugraph">✓ Built-in Real-Time</td>
                  <td className="td-other">✕ None</td>
                  <td className="td-other">⚠️ Third-party Plugins</td>
                </tr>
                <tr>
                  <td className="td-feature-name">
                    <strong>Post-Submission 20-MCQ Quiz</strong>
                    <span>Instant ownership validation</span>
                  </td>
                  <td className="td-edugraph">✓ Automated & Linked</td>
                  <td className="td-other">✕ None</td>
                  <td className="td-other">⚠️ Disconnected Quizzes</td>
                </tr>
                <tr>
                  <td className="td-feature-name">
                    <strong>Cohort Concept Heatmaps</strong>
                    <span>Faculty visual analytics</span>
                  </td>
                  <td className="td-edugraph">✓ Instant Telemetry</td>
                  <td className="td-other">✕ None</td>
                  <td className="td-other">✕ Basic Grade Lists</td>
                </tr>
                <tr>
                  <td className="td-feature-name">
                    <strong>Cryptographic Audit Dossier</strong>
                    <span>SHA-256 state validation</span>
                  </td>
                  <td className="td-edugraph">✓ Immutable Hashed</td>
                  <td className="td-other">✕ None</td>
                  <td className="td-other">✕ Basic Timestamp</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="features-cta-section">
        <div className="features-cta-card">
          <div className="cta-content">
            <span className="cta-badge">INTEGRATE TODAY</span>
            <h2 className="cta-title">Ready to Elevate Your Institution’s Academic Standards?</h2>
            <p className="cta-desc">
              Schedule a personalized walkthrough of the Edudraw Whiteboard Canvas and anti-cheat proctoring suite.
            </p>
            <div className="cta-actions-row">
              <button 
                className="feat-cta-btn primary"
                onClick={() => navigateTo('contact')}
              >
                Schedule Technical Demo →
              </button>
              <button 
                className="feat-cta-btn secondary"
                onClick={() => navigateTo('services')}
              >
                View Institutional Services
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}