import React from 'react'
import './AboutUs.css'

export default function AboutUs({ onNavigate }) {
  const navigateTo = (tab) => {
    if (onNavigate) {
      onNavigate(tab)
    } else {
      window.location.hash = `#${tab}`
    }
  }

  return (
    <div className="about-page-wrapper">
      
      {/* 1. Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-container">
          <div className="about-badge-pill">
            <span className="about-badge-dot" />
            <span>WHO WE ARE & OUR MISSION</span>
          </div>

          <h1 className="about-headline">
            Pioneering the Future of <br className="hidden-mobile" />
            <span className="about-gradient-text">Visual Education & Verified Integrity</span>
          </h1>

          <div className="about-sketch-divider" aria-hidden="true" />

          <p className="about-subheadline">
            EduGraph was founded with a singular conviction: genuine learning requires active visual construction, not superficial rote memorization. We empower universities, faculty, and students with interactive whiteboard knowledge graphs and tamper-proof proctoring verification.
          </p>

          <div className="about-hero-stats-row">
            <div className="hero-mini-stat">
              <span className="mini-stat-num">250+</span>
              <span className="mini-stat-lbl">Institutions</span>
            </div>
            <div className="hero-mini-stat-divider" />
            <div className="hero-mini-stat">
              <span className="mini-stat-num">10K+</span>
              <span className="mini-stat-lbl">Active Minds</span>
            </div>
            <div className="hero-mini-stat-divider" />
            <div className="hero-mini-stat">
              <span className="mini-stat-num">+3.8x</span>
              <span className="mini-stat-lbl">Concept Retention</span>
            </div>
            <div className="hero-mini-stat-divider" />
            <div className="hero-mini-stat">
              <span className="mini-stat-num">99.4%</span>
              <span className="mini-stat-lbl">Proctored Integrity</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Cognitive Architecture Whiteboard */}
      <section className="about-whiteboard-section">
        <div className="about-content-container">
          <div className="about-section-header">
            <span className="section-eyebrow">COGNITIVE SCIENCE & ARCHITECTURE</span>
            <h2 className="about-section-title">How Visual Graphs Unlock Enduring Memory</h2>
            <p className="about-section-desc">
              Grounded in Paivio’s Dual-Coding Theory and spatial neuroplasticity, EduGraph transforms ephemeral text into durable mental structures.
            </p>
          </div>

          {/* Large Edudraw Whiteboard Canvas */}
          <div className="about-wb-card">
            
            {/* Whiteboard Header */}
            <div className="about-wb-header">
              <div className="about-wb-dots">
                <span className="dot dot-red" />
                <span className="dot dot-amber" />
                <span className="dot dot-green" />
              </div>
              <div className="about-wb-title-box">
                <span className="about-wb-title">Edudraw Canvas • Pedagogical Model [Cognitive Flow]</span>
                <span className="about-wb-badge">VERIFIED BY DESIGN</span>
              </div>
              <div className="about-wb-tools">
                <span className="about-wb-tool-pill active">✏️ Draw Node</span>
                <span className="about-wb-tool-pill">⇄ Link</span>
                <span className="about-wb-tool-pill">📌 Annotate</span>
                <span className="about-wb-zoom">100%</span>
              </div>
            </div>

            {/* Whiteboard Body Surface */}
            <div className="about-wb-surface">
              
              <div className="about-canvas-grid-flow">
                
                {/* Node 1: Visual Encoding */}
                <div className="about-canvas-node node-teal">
                  <div className="node-head">
                    <span className="node-icon">🧠</span>
                    <span className="node-tag">COGNITIVE STEP 1</span>
                  </div>
                  <h4 className="node-title">Spatial Encoding</h4>
                  <p className="node-body">Students draw concept vertices, mapping formulas and theorems as interactive spatial entities.</p>
                  <div className="node-footer-meta">
                    <span>+2.4x Spatial Anchor</span>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="about-flow-connector">
                  <span className="connector-label">Synthesizes ➔</span>
                  <div className="connector-arrow-line">
                    <svg viewBox="0 0 80 18" className="flow-svg-arrow" preserveAspectRatio="none">
                      <line x1="0" y1="9" x2="68" y2="9" stroke="#1B7F72" strokeWidth="2.5" strokeDasharray="4 3" />
                      <polygon points="66,4 78,9 66,14" fill="#1B7F72" />
                    </svg>
                  </div>
                </div>

                {/* Node 2: Relational Topology */}
                <div className="about-canvas-node node-navy">
                  <div className="node-head">
                    <span className="node-icon">🌐</span>
                    <span className="node-tag">COGNITIVE STEP 2</span>
                  </div>
                  <h4 className="node-title">Relational Topology</h4>
                  <p className="node-body">Bidirectional edges connect principles to lab evidence, cementing logical causality between concepts.</p>
                  <div className="node-footer-meta">
                    <span>Deep Structural Neural Maps</span>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="about-flow-connector">
                  <span className="connector-label">Locks In ➔</span>
                  <div className="connector-arrow-line">
                    <svg viewBox="0 0 80 18" className="flow-svg-arrow" preserveAspectRatio="none">
                      <line x1="0" y1="9" x2="68" y2="9" stroke="#C6822E" strokeWidth="2.5" strokeDasharray="4 3" />
                      <polygon points="66,4 78,9 66,14" fill="#C6822E" />
                    </svg>
                  </div>
                </div>

                {/* Node 3: Immediate Verification */}
                <div className="about-canvas-node node-green">
                  <div className="node-head">
                    <span className="node-icon">🛡️</span>
                    <span className="node-tag">COGNITIVE STEP 3</span>
                  </div>
                  <h4 className="node-title">Integrity Shield & Quiz</h4>
                  <p className="node-body">Continuous tab monitoring and immediate 20-MCQ validation guarantee authentic comprehension.</p>
                  <div className="node-footer-meta">
                    <span>100% Genuine Authorship</span>
                  </div>
                </div>

              </div>

              {/* Whiteboard Sticky Notes */}
              <div className="about-sticky-notes-row">
                <div className="about-sticky-note sticky-amber">
                  <span className="sticky-pin">📌</span>
                  <p><strong>The Retention Dividend:</strong> Relational diagrams resist memory decay up to 4x longer than linear bullet points.</p>
                </div>
                <div className="about-sticky-note sticky-teal">
                  <span className="sticky-pin">📍</span>
                  <p><strong>Anti-Cheat Guarantee:</strong> You cannot fake an interactive topology graph followed by real-time validation.</p>
                </div>
              </div>

            </div>

            {/* Whiteboard Footer */}
            <div className="about-wb-footer">
              <span className="wb-live-status">● Live Canvas Engine • Continuous Educational Verification</span>
              <span className="wb-audit-tag">Patent-Pending Pedagogical Topology</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The Origin & Problem Section */}
      <section className="about-origin-section">
        <div className="about-content-container">
          <div className="about-origin-grid">
            
            <div className="about-origin-text">
              <span className="section-eyebrow">OUR ORIGIN STORY</span>
              <h2 className="about-sub-title">Why We Built EduGraph</h2>
              <div className="about-sketch-divider-left" aria-hidden="true" />
              
              <p className="origin-para">
                Over the past decade, higher education entered an invisible crisis. Assignments evolved into transactional rituals: students cramming text the night before, submitting unverified files, and instantly forgetting core theories once exams concluded.
              </p>
              
              <p className="origin-para">
                Meanwhile, educators faced an overwhelming wave of digital shortcuts, making it almost impossible to verify whether a student genuinely understood the material or simply outsourced the answer.
              </p>

              <p className="origin-para">
                We designed EduGraph as the antidote. By combining dynamic whiteboard drawing tools with live proctoring and automated comprehension verification, we give faculty absolute confidence and provide students a joyful, visual way to truly master complex ideas.
              </p>

              <div className="origin-highlight-box">
                <span className="highlight-icon">💡</span>
                <p>
                  <em>"True education is not the memorization of facts, but the training of the mind to think relationally."</em>
                </p>
              </div>
            </div>

            {/* Contrast Comparison Matrix */}
            <div className="about-contrast-card">
              <div className="contrast-header">
                <h4>Traditional Learning vs. EduGraph</h4>
                <span className="contrast-pill">PARADIGM SHIFT</span>
              </div>

              <div className="contrast-row problem-row">
                <div className="contrast-icon-badge icon-bad">✕</div>
                <div className="contrast-detail">
                  <strong>The Broken Status Quo</strong>
                  <p>Passive reading, fragile rote memorization, and unverified submissions vulnerable to external copying.</p>
                </div>
              </div>

              <div className="contrast-divider-icon">➔ Transformed by EduGraph ➔</div>

              <div className="contrast-row solution-row">
                <div className="contrast-icon-badge icon-good">✓</div>
                <div className="contrast-detail">
                  <strong>The EduGraph Paradigm</strong>
                  <p>Spatial node graphs built on Edudraw whiteboards, live window monitoring, and instant 20-MCQ validation.</p>
                </div>
              </div>

              <div className="contrast-footer">
                <div className="c-stat">
                  <strong>0%</strong>
                  <span>Plagiarism Allowed</span>
                </div>
                <div className="c-sep" />
                <div className="c-stat">
                  <strong>+3.8x</strong>
                  <span>Retention Boost</span>
                </div>
                <div className="c-sep" />
                <div className="c-stat">
                  <strong>100%</strong>
                  <span>Verified Authorship</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Our 4 Core Pillars */}
      <section className="about-pillars-section">
        <div className="about-content-container">
          <div className="about-section-header">
            <span className="section-eyebrow">OUR FOUNDATIONAL TENETS</span>
            <h2 className="about-section-title">The Four Pillars of EduGraph</h2>
            <p className="about-section-desc">
              Every feature across our whiteboard and security infrastructure is architected upon four core principles.
            </p>
          </div>

          <div className="about-pillars-grid">
            
            <div className="pillar-card">
              <div className="pillar-icon-box icon-teal">01</div>
              <h3 className="pillar-heading">Spatial Knowledge Graphing</h3>
              <p className="pillar-description">
                Concepts are not linear sentences. Students construct living topological networks, interconnecting formulas, proofs, and real-world experiments on high-performance canvases.
              </p>
              <ul className="pillar-checklist">
                <li>✓ Edudraw Whiteboard Canvas</li>
                <li>✓ Bi-directional Node Linking</li>
                <li>✓ Real-Time Visual Synthesis</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box icon-navy">02</div>
              <h3 className="pillar-heading">Live Anti-Cheat Shield</h3>
              <p className="pillar-description">
                Genuine mastery requires focused intellectual effort. Real-time browser visibility tracking and tab-switch detection actively discourage external shortcuts without intrusive spyware.
              </p>
              <ul className="pillar-checklist">
                <li>✓ Page Visibility Telemetry</li>
                <li>✓ Instant Focus Logging</li>
                <li>✓ Privacy-First Proctored Flow</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box icon-amber">03</div>
              <h3 className="pillar-heading">20-MCQ Instant Validation</h3>
              <p className="pillar-description">
                Immediately following canvas submission, students complete an automated conceptual quiz targeted at their graph nodes to guarantee authentic comprehension and authorship.
              </p>
              <ul className="pillar-checklist">
                <li>✓ Instant Automated Scoring</li>
                <li>✓ Node-Linked Questions</li>
                <li>✓ Authenticity Verification</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box icon-green">04</div>
              <h3 className="pillar-heading">Institutional Telemetry</h3>
              <p className="pillar-description">
                Principals and professors gain real-time visibility into student understanding, identifying conceptual roadblocks long before midterms or final accreditation audits.
              </p>
              <ul className="pillar-checklist">
                <li>✓ Campus Principal Portal</li>
                <li>✓ Faculty Grade Cascades</li>
                <li>✓ Tamper-Proof Audit Logs</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Our Core Values */}
      <section className="about-values-section">
        <div className="about-content-container">
          <div className="about-section-header">
            <span className="section-eyebrow">ETHICAL COMPASS</span>
            <h2 className="about-section-title">What Drives Our Work</h2>
            <p className="about-section-desc">
              We hold academic institutions and educational technologies to the highest moral and cognitive standards.
            </p>
          </div>

          <div className="about-values-grid">
            <div className="value-card">
              <span className="value-symbol">⚖️</span>
              <h4>Authenticity Over Speed</h4>
              <p>We reject quick-fix shortcuts that undermine true learning. We prioritize deep, enduring understanding.</p>
            </div>
            <div className="value-card">
              <span className="value-symbol">🛡️</span>
              <h4>Institutional Trust</h4>
              <p>We provide transparent, auditable verification data that deans, faculties, and students can rely upon with confidence.</p>
            </div>
            <div className="value-card">
              <span className="value-symbol">🎨</span>
              <h4>Joyful Visual Thinking</h4>
              <p>Education should feel creative and exploratory. Our interactive whiteboard canvas makes abstract ideas intuitive.</p>
            </div>
            <div className="value-card">
              <span className="value-symbol">🌱</span>
              <h4>Accessibility & Scalability</h4>
              <p>Designed to scale seamlessly from single classrooms to statewide university systems with zero overhead.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action Banner */}
      <section className="about-cta-section">
        <div className="about-cta-card">
          <div className="cta-content">
            <span className="cta-badge">TRANSFORM YOUR CAMPUS</span>
            <h2 className="cta-title">Join 250+ Institutions Elevating Academic Integrity</h2>
            <p className="cta-desc">
              Empower your faculty with verified whiteboard telemetry and give your students the cognitive gift of spatial visual learning.
            </p>
            <div className="cta-actions-row">
              <button 
                className="about-cta-btn primary"
                onClick={() => navigateTo('contact')}
              >
                Schedule Campus Demo →
              </button>
              <button 
                className="about-cta-btn secondary"
                onClick={() => navigateTo('features')}
              >
                Explore Platform Features
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}