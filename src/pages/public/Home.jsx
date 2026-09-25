import React from 'react'
import './Home.css'

export default function Home() {
  return (
    <div className="home-container">
      {/* =========================================================================
          HERO BANNER SECTION (Wix Studio 3291 Wireframe Layout)
          - Light, luminous aesthetic background
          - Centered Headline, Subtitle & Pill CTA
          - Staggered 3-Card Visual Showcase (Center Portrait, Left & Right Overlays)
          - Vision statement block & 4-Column Stats Grid
          ========================================================================= */}
      <section className="hero-banner-section" id="home">
        <div className="hero-content-wrapper">

          {/* 1. Centered Hero Header & Call to Action */}
          <div className="hero-header-block">
            <div className="hero-badge-pill">
              <span className="badge-dot" aria-hidden="true" />
              <span>Interactive Visual Knowledge Platform</span>
            </div>

            <h1 className="hero-headline">
              Transform Learning into Interactive <span className="highlight-text">Knowledge Graphs</span>
            </h1>

            <p className="hero-subtitle">
              Connect concepts, build whiteboard topic maps, and complete assignments with
              real-time anti-cheat verification and instant server-scored quizzes.
            </p>

            <div className="hero-cta-group">
              <a href="#whiteboard" className="hero-primary-pill-btn">
                <span>Launch Whiteboard</span>
                <span className="btn-sketch-arrow" aria-hidden="true">↗</span>
              </a>
              <a href="#features" className="hero-secondary-pill-btn">
                <span>Explore Features</span>
              </a>
            </div>
          </div>

          {/* 2. Staggered 3-Card Visual Showcase */}
          <div className="hero-showcase-container">

            {/* Left Card: Knowledge Nodes & Topic Links */}
            <div className="showcase-card card-left">
              <div className="card-pill-tag">
                <span className="tag-indicator tag-teal" />
                <span>Concept Topology</span>
              </div>
              <h3 className="card-title">Bidirectional Topic Linking</h3>
              <p className="card-desc">
                Organize lectures into modular study nodes that link ideas across subjects.
              </p>

              {/* Hand-drawn visual node diagram */}
              <div className="mini-graph-preview">
                <div className="mini-node node-a">Wave Mechanics</div>
                <div className="mini-connector-line">
                  <span className="connector-pulse" />
                </div>
                <div className="mini-node node-b">Quantum Optics</div>
              </div>

              <div className="card-footer-meta">
                <span className="meta-badge">⚡ Real-time Synced</span>
                <span className="meta-subtext">32 Active Nodes</span>
              </div>
            </div>

            {/* Center Card: Main Whiteboard Canvas Studio (Tall Portrait Anchor) */}
            <div className="showcase-card card-center">
              {/* Studio Canvas Toolbar */}
              <div className="canvas-header-bar">
                <div className="canvas-window-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-amber" />
                  <span className="dot dot-green" />
                </div>
                <div className="canvas-tool-icons">
                  <span className="tool-pill active" title="Pencil Tool">✏️ Draw</span>
                  <span className="tool-pill" title="Concept Node">▢ Node</span>
                  <span className="tool-pill" title="Link Connector">⇄ Connect</span>
                  <span className="tool-pill" title="Sticky Note">📝 Note</span>
                </div>
              </div>

              {/* Canvas Interactive Whiteboard Demonstration */}
              <div className="canvas-body-mockup">

                {/* Central Concept Node */}
                <div className="canvas-node main-node">
                  <span className="node-subject-badge">PHY-301</span>
                  <h4>Maxwell's Equations</h4>
                  <p>Unified Electromagnetism</p>
                </div>

                {/* Branch Connections */}
                <div className="canvas-arrow-branch branch-left">
                  <span className="arrow-label">Gauss Law ➔</span>
                </div>
                <div className="canvas-arrow-branch branch-right">
                  <span className="arrow-label">Ampere's Law ➔</span>
                </div>

                {/* Sub Nodes */}
                <div className="canvas-subnodes-row">
                  <div className="canvas-subnode">Electric Flux</div>
                  <div className="canvas-subnode">Magnetic Dipole</div>
                </div>

                {/* Sticky Note Accent */}
                <div className="canvas-sticky-note">
                  <span className="sticky-pin">📌</span>
                  <span className="sticky-text">Exam Focus: Derive wave equation from curl!</span>
                </div>

                {/* Active Collaborator Avatar */}
                <div className="canvas-collaborator-pill">
                  <span className="collab-avatar">🎓</span>
                  <span>Aryan • Editing Node #4</span>
                </div>
              </div>

              {/* Center Card Footer */}
              <div className="canvas-status-footer">
                <span className="status-indicator-live">● Live Edudraw Engine</span>
                <span className="status-autosave">Autosaved to Cloud</span>
              </div>
            </div>

            {/* Right Card: Anti-Cheat Verification & Scoring */}
            <div className="showcase-card card-right">
              <div className="card-pill-tag">
                <span className="tag-indicator tag-green" />
                <span>Verification Shield</span>
              </div>
              <h3 className="card-title">Anti-Cheat Proctoring</h3>
              <p className="card-desc">
                Page visibility tracking prevents external tab switches during submissions.
              </p>

              {/* Live Proctoring & Scoring Metrics */}
              <div className="security-status-box">
                <div className="security-stat-row">
                  <span className="sec-label">Tab Switch Monitor</span>
                  <span className="sec-val sec-green">0 Violations (Clean)</span>
                </div>
                <div className="security-stat-row">
                  <span className="sec-label">20-MCQ Verification</span>
                  <span className="sec-val sec-amber">20/20 Passed (100%)</span>
                </div>
                <div className="security-stat-row">
                  <span className="sec-label">Assignment Status</span>
                  <span className="sec-val sec-blue">Verified & Graded</span>
                </div>
              </div>

              <div className="card-footer-meta">
                <span className="meta-badge-success">✓ 100% Genuine Submission</span>
              </div>
            </div>

          </div>

          {/* 3. Vision Statement Section */}
          <div className="hero-vision-section" id="about">
            <div className="vision-layout-grid">
              
              {/* Left Column: Vision Narrative */}
              <div className="vision-text-col">
                <div className="vision-header">
                  <span className="section-eyebrow">Institutional Philosophy</span>
                  <h2 className="vision-title">Our Vision</h2>
                  <div className="vision-sketch-divider" aria-hidden="true" />
                </div>
                <p className="vision-desc">
                  EduGraph bridges the gap between conceptual visual thinking and uncompromising academic
                  integrity. By empowering students to map out knowledge on interactive Edudraw canvases
                  and backing every assignment with real-time proctored validation, we provide universities,
                  professors, and students with a trusted platform for deep, enduring comprehension.
                </p>
                <div className="vision-feature-pills">
                  <span className="v-pill">✦ Spatial Mind Mapping</span>
                  <span className="v-pill">✦ Fraud-Proof Assessments</span>
                  <span className="v-pill">✦ Active Concept Retention</span>
                </div>
              </div>

              {/* Right Column: Small Whiteboard Showing Vision */}
              <div className="vision-whiteboard-card">
                <div className="mini-wb-header">
                  <div className="mini-wb-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-amber" />
                    <span className="dot dot-green" />
                  </div>
                  <span className="mini-wb-title">Edudraw Canvas • Vision Topology</span>
                  <span className="mini-wb-badge">LIVE ENGINE</span>
                </div>

                <div className="mini-wb-canvas-area">
                  {/* Central Vision Node */}
                  <div className="wb-node wb-center-node">
                    <span className="wb-node-icon">💡</span>
                    <span className="wb-node-text">Conceptual Mastery</span>
                  </div>

                  {/* Connecting Branches */}
                  <div className="wb-connectors-wrapper">
                    <div className="wb-branch-item">
                      <span className="wb-arrow-text">Visual Mapping ➔</span>
                      <div className="wb-node wb-sub-node">
                        <span className="wb-node-icon">🧠</span>
                        <span>Mind Graph</span>
                      </div>
                    </div>

                    <div className="wb-branch-item">
                      <span className="wb-arrow-text">➔ Verification</span>
                      <div className="wb-node wb-sub-node">
                        <span className="wb-node-icon">🛡️</span>
                        <span>Integrity Shield</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Sticky Note */}
                  <div className="wb-mini-sticky">
                    <span className="sticky-pin">📌</span>
                    <span>Zero Cheating • 100% Genuine Understanding</span>
                  </div>
                </div>

                <div className="mini-wb-footer">
                  <span className="wb-sync-text">● Node Topology Synced</span>
                  <span>v2.4 Edudraw Core</span>
                </div>
              </div>

            </div>
          </div>

          {/* Horizontal Dashed Divider */}
          <div className="hero-dashed-divider" aria-hidden="true" />

          {/* 4. Our Goal Section with Visualizations */}
          <div className="hero-goal-section">
            <div className="goal-layout-grid">
              
              {/* Left Column: Goal Text & Milestones */}
              <div className="goal-text-col">
                <span className="section-eyebrow">Strategic Milestones</span>
                <h2 className="goal-title">Our Goal</h2>
                <p className="goal-desc">
                  Empowering institutions, educators, and learners with verified visual knowledge graphs—fostering genuine conceptual mastery, effortless credential workflows, and uncompromising academic integrity worldwide.
                </p>

                <div className="goal-milestones-list">
                  <div className="goal-milestone-item">
                    <span className="milestone-check">✓</span>
                    <div>
                      <strong>Elevate Global Retention</strong>
                      <p>Replace passive memorization with visual node graphs proven to improve 6-month recall by 3.8x.</p>
                    </div>
                  </div>
                  <div className="goal-milestone-item">
                    <span className="milestone-check">✓</span>
                    <div>
                      <strong>Automated Institutional Trust</strong>
                      <p>Seamless zero-friction onboarding for 250+ campuses with zero credential mismanagement.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Chart / Graph Visualization */}
              <div className="goal-visualization-card">
                <div className="chart-card-header">
                  <div>
                    <h4 className="chart-card-title">Concept Retention & Integrity Index</h4>
                    <span className="chart-card-subtitle">Visual Whiteboard vs Traditional Passive Learning</span>
                  </div>
                  <span className="chart-live-tag">● Telemetry Live</span>
                </div>

                {/* SVG Area / Line Chart */}
                <div className="svg-chart-container">
                  <svg viewBox="0 0 420 170" className="analytics-svg" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1B7F72" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#1B7F72" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C6822E" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#C6822E" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Chart Grid Lines */}
                    <line x1="40" y1="30" x2="400" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1="40" y1="75" x2="400" y2="75" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1="40" y1="120" x2="400" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1="40" y1="150" x2="400" y2="150" stroke="#CBD5E1" strokeWidth="1.5" />

                    {/* Y-Axis Labels */}
                    <text x="8" y="34" fill="#94A3B8" fontSize="10" fontFamily="Space Grotesk">100%</text>
                    <text x="14" y="79" fill="#94A3B8" fontSize="10" fontFamily="Space Grotesk">75%</text>
                    <text x="14" y="124" fill="#94A3B8" fontSize="10" fontFamily="Space Grotesk">50%</text>

                    {/* Passive Learning Curve (Declining Amber) */}
                    <path
                      d="M 40 55 C 120 70, 220 115, 400 132 L 400 150 L 40 150 Z"
                      fill="url(#amberGrad)"
                    />
                    <path
                      d="M 40 55 C 120 70, 220 115, 400 132"
                      fill="none"
                      stroke="#C6822E"
                      strokeWidth="2.2"
                      strokeDasharray="4 4"
                    />

                    {/* EduGraph Visual Curve (Rising High Teal) */}
                    <path
                      d="M 40 115 C 120 68, 240 42, 400 28 L 400 150 L 40 150 Z"
                      fill="url(#tealGrad)"
                    />
                    <path
                      d="M 40 115 C 120 68, 240 42, 400 28"
                      fill="none"
                      stroke="#1B7F72"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />

                    {/* Highlight Peak Dot */}
                    <circle cx="400" cy="28" r="5" fill="#1B7F72" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>

                  {/* Chart Legend */}
                  <div className="chart-legend-row">
                    <span className="legend-item legend-teal">
                      <span className="legend-dot teal-dot" /> EduGraph Visual Knowledge (94.8% Recall)
                    </span>
                    <span className="legend-item legend-amber">
                      <span className="legend-dot amber-dot" /> Traditional Memorization (38.2%)
                    </span>
                  </div>
                </div>

                {/* Performance Metric Counters */}
                <div className="chart-metrics-row">
                  <div className="chart-metric-stat">
                    <span className="metric-val">+3.8x</span>
                    <span className="metric-lbl">Concept Recall Speed</span>
                  </div>
                  <div className="chart-metric-stat">
                    <span className="metric-val">99.4%</span>
                    <span className="metric-lbl">Fraud-Proof Integrity</span>
                  </div>
                  <div className="chart-metric-stat">
                    <span className="metric-val">&lt; 0.2s</span>
                    <span className="metric-lbl">Instant Quiz Score</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Horizontal Dashed Divider */}
          <div className="hero-dashed-divider" aria-hidden="true" />

          {/* 5. What is the Problem & How We Solve It Section (Title on the Right) */}
          <div className="hero-problem-solution-section" id="problem-solution">
            <div className="ps-layout-grid">
              
              {/* Left Column: Visual Problem vs Solution Comparison Matrix Card */}
              <div className="ps-visual-col">
                <div className="ps-matrix-card">
                  
                  {/* Card Header */}
                  <div className="ps-matrix-header">
                    <div className="ps-badge-group">
                      <span className="ps-header-badge">EVALUATION PARADIGM SHIFT</span>
                    </div>
                    <span className="ps-status-pill">● Comparative Analysis</span>
                  </div>

                  {/* Problem Block (Traditional System) */}
                  <div className="ps-contrast-box ps-problem-box">
                    <div className="ps-box-head">
                      <span className="ps-box-icon ps-problem-icon">✕</span>
                      <div className="ps-box-info">
                        <h4 className="ps-box-title">The Core Problem</h4>
                        <span className="ps-box-subtitle">Superficial Cramming & Unverified Submissions</span>
                      </div>
                      <span className="ps-tag ps-tag-problem">Traditional Flaw</span>
                    </div>
                    <ul className="ps-points-list">
                      <li>
                        <span className="ps-bullet ps-bullet-problem">!</span>
                        <div>
                          <strong>Fragile Rote Recall</strong>
                          <p>Formulas and theories crammed the night before vanish from memory within days without relational anchors.</p>
                        </div>
                      </li>
                      <li>
                        <span className="ps-bullet ps-bullet-problem">!</span>
                        <div>
                          <strong>Unverified Copy-Pasting</strong>
                          <p>Traditional PDF/text uploads allow unchecked external copying and AI generation to pass without genuine comprehension.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Visual Bridge Indicator */}
                  <div className="ps-bridge-indicator">
                    <span className="ps-bridge-arrow">▼</span>
                    <span className="ps-bridge-label">EduGraph Verified Solution Architecture</span>
                    <span className="ps-bridge-arrow">▼</span>
                  </div>

                  {/* Solution Block (EduGraph System) */}
                  <div className="ps-contrast-box ps-solution-box">
                    <div className="ps-box-head">
                      <span className="ps-box-icon ps-solution-icon">✓</span>
                      <div className="ps-box-info">
                        <h4 className="ps-box-title">How We Solve It</h4>
                        <span className="ps-box-subtitle">Spatial Mind Graphs + Fraud-Proof Proctoring</span>
                      </div>
                      <span className="ps-tag ps-tag-solution">EduGraph Fix</span>
                    </div>
                    <ul className="ps-points-list">
                      <li>
                        <span className="ps-bullet ps-bullet-solution">✦</span>
                        <div>
                          <strong>Edudraw Spatial Node Graphing</strong>
                          <p>Students build interactive visual topology boards, forming deep conceptual mental models that yield +3.8x retention.</p>
                        </div>
                      </li>
                      <li>
                        <span className="ps-bullet ps-bullet-solution">✦</span>
                        <div>
                          <strong>Live Proctoring & 20-MCQ Validation</strong>
                          <p>Page visibility tracking flags tab switching, followed by instant validation quizzes ensuring 100% genuine mastery.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Footer Metric Banner */}
                  <div className="ps-matrix-footer">
                    <div className="ps-footer-stat">
                      <span className="ps-stat-highlight">0%</span>
                      <span className="ps-stat-sub">Plagiarism Tolerance</span>
                    </div>
                    <div className="ps-footer-divider" />
                    <div className="ps-footer-stat">
                      <span className="ps-stat-highlight">+3.8x</span>
                      <span className="ps-stat-sub">Enduring Retention</span>
                    </div>
                    <div className="ps-footer-divider" />
                    <div className="ps-footer-stat">
                      <span className="ps-stat-highlight">99.4%</span>
                      <span className="ps-stat-sub">Proctored Authenticity</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Section Title & Narrative Pillars */}
              <div className="ps-text-col">
                <div className="ps-header-block">
                  <span className="section-eyebrow">Academic Crisis & Breakthrough</span>
                  <h2 className="ps-title">What is the Problem & How We Solve It</h2>
                  <div className="ps-sketch-divider" aria-hidden="true" />
                </div>

                <p className="ps-desc">
                  Higher education faces an unprecedented crisis of retention and integrity. Traditional assignment workflows reward passive text recitation, leaving professors powerless against superficial understanding and unverified shortcuts.
                </p>

                <div className="ps-pillars-list">
                  <div className="ps-pillar-item">
                    <div className="pillar-num-badge">01</div>
                    <div className="pillar-content">
                      <strong>From Passive Memorization to Visual Construction</strong>
                      <p>Students shift from passive readers to active knowledge architects—mapping formulas, proofs, and principles onto dynamic Edudraw whiteboards.</p>
                    </div>
                  </div>

                  <div className="ps-pillar-item">
                    <div className="pillar-num-badge">02</div>
                    <div className="pillar-content">
                      <strong>Restoring Institutional Integrity via Live Proctoring</strong>
                      <p>Tab-switch monitoring halts unauthorized external aids in real time, while instant post-submission quizzes verify that students truly own their work.</p>
                    </div>
                  </div>

                  <div className="ps-pillar-item">
                    <div className="pillar-num-badge">03</div>
                    <div className="pillar-content">
                      <strong>Actionable Telemetry for Faculty & Leadership</strong>
                      <p>Educators receive instant visual comprehension heatmaps, identifying class-wide bottlenecks and conceptual gaps long before final exams.</p>
                    </div>
                  </div>
                </div>

                <div className="ps-action-badges">
                  <span className="ps-action-pill">✓ Anti-Cheat Monitored</span>
                  <span className="ps-action-pill">✓ Edudraw Whiteboard Canvas</span>
                  <span className="ps-action-pill">✓ Instant Grade Verification</span>
                </div>
              </div>

            </div>
          </div>

          {/* Horizontal Dashed Divider */}
          <div className="hero-dashed-divider" aria-hidden="true" />

          <div className="hero-stats-grid">
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Student Minds</div>
              <p className="stat-subtext">Mapping concepts daily across disciplines and engineering subjects.</p>
            </div>

            <div className="stat-card">
              <div className="stat-number">250+</div>
              <div className="stat-label">Institutional Colleges</div>
              <p className="stat-subtext">Empowered by automated onboarding and credential cascade workflows.</p>
            </div>

            <div className="stat-card">
              <div className="stat-number">3K+</div>
              <div className="stat-label">Whiteboard Topic Graphs</div>
              <p className="stat-subtext">Connecting core theories, equations, proofs, and laboratory records.</p>
            </div>

            <div className="stat-card">
              <div className="stat-number">+99.4%</div>
              <div className="stat-label">Verified Integrity Rate</div>
              <p className="stat-subtext">Ensured through live Page Visibility proctoring and post-submission quizzes.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}