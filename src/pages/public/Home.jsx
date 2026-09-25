import React from 'react'
import {
  IconBolt,
  IconPencil,
  IconPin,
  IconGraduation,
  IconLightbulb,
  IconBrain,
  IconShield,
  IconInstitution,
  IconTarget,
  IconRefresh
} from '../../components/common/Icons'
import './Home.css'

export default function Home({ onNavigate }) {
  const navigateTo = (tab) => {
    if (onNavigate) {
      onNavigate(tab)
    } else {
      window.location.hash = `#${tab}`
    }
  }

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
                <span className="meta-badge"><IconBolt size={13} color="#C6822E" /> Real-time Synced</span>
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
                  <span className="tool-pill active" title="Pencil Tool"><IconPencil size={13} color="#1B7F72" /> Draw</span>
                  <span className="tool-pill" title="Concept Node">▢ Node</span>
                  <span className="tool-pill" title="Link Connector">⇄ Connect</span>
                  <span className="tool-pill" title="Sticky Note"><IconPin size={13} color="#1B7F72" /> Note</span>
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
                  <span className="sticky-pin"><IconPin size={13} color="#C6822E" /></span>
                  <span className="sticky-text">Exam Focus: Derive wave equation from curl!</span>
                </div>

                {/* Active Collaborator Avatar */}
                <div className="canvas-collaborator-pill">
                  <span className="collab-avatar"><IconGraduation size={14} color="#1B7F72" /></span>
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

          {/* 3. About Us & Vision Statement Section */}
          <div className="hero-vision-section" id="about">
            <div className="vision-layout-grid">
              
              {/* Left Column: Vision Narrative */}
              <div className="vision-text-col">
                <div className="vision-header">
                  <span className="section-eyebrow">WHO WE ARE & OUR MISSION</span>
                  <h2 className="vision-title">About Us & Our Vision</h2>
                  <div className="vision-sketch-divider" aria-hidden="true" />
                </div>
                <p className="vision-desc">
                  Bridging spatial visual thinking with uncompromising academic integrity—transforming flat memorization into active, verified conceptual mastery across 250+ partner universities.
                </p>
                <div className="vision-feature-pills">
                  <span className="v-pill">✦ Spatial Mind Graphs</span>
                  <span className="v-pill">✦ Live Anti-Cheat Shield</span>
                  <button 
                    type="button"
                    className="v-pill v-pill-link"
                    onClick={() => navigateTo('about')}
                  >
                    Explore Full About Us Story →
                  </button>
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
                    <span className="wb-node-icon"><IconLightbulb size={18} color="#C6822E" /></span>
                    <span className="wb-node-text">Conceptual Mastery</span>
                  </div>

                  {/* Connecting Branches */}
                  <div className="wb-connectors-wrapper">
                    <div className="wb-branch-item">
                      <span className="wb-arrow-text">Visual Mapping ➔</span>
                      <div className="wb-node wb-sub-node">
                        <span className="wb-node-icon"><IconBrain size={18} color="#1B7F72" /></span>
                        <span>Mind Graph</span>
                      </div>
                    </div>

                    <div className="wb-branch-item">
                      <span className="wb-arrow-text">➔ Verification</span>
                      <div className="wb-node wb-sub-node">
                        <span className="wb-node-icon"><IconShield size={18} color="#16A34A" /></span>
                        <span>Integrity Shield</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Sticky Note */}
                  <div className="wb-mini-sticky">
                    <span className="sticky-pin"><IconPin size={13} color="#C6822E" /></span>
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
          <div className="hero-goal-section" id="services">
            <div className="goal-layout-grid">
              
              {/* Left Column: Goal Text & Milestones */}
              <div className="goal-text-col">
                <span className="section-eyebrow">Strategic Milestones</span>
                <h2 className="goal-title">Our Goal</h2>
                <p className="goal-desc">
                  Empowering campuses with verified visual knowledge graphs—fostering deep conceptual comprehension and automated institutional trust.
                </p>

                <div className="goal-milestones-list">
                  <div className="goal-milestone-item">
                    <span className="milestone-check">✓</span>
                    <div>
                      <strong>+3.8x Higher Retention</strong>
                      <p>Spatial node graphs replace fragile cramming with structural memory.</p>
                    </div>
                  </div>
                  <div className="goal-milestone-item">
                    <span className="milestone-check">✓</span>
                    <div>
                      <strong>Automated Institutional Scale</strong>
                      <p>Seamless onboarding for 250+ campuses with zero credential mismanagement.</p>
                    </div>
                  </div>
                </div>

                <div className="goal-action-pills">
                  <a href="#services" className="v-pill v-pill-link">Explore Campus Services →</a>
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

            {/* 4-Column Goal Impact / Institutional Statistics Grid */}
            <div className="hero-stats-grid">
              <div className="stat-card">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Student Minds</div>
                <p className="stat-subtext">Mapping concepts daily across disciplines.</p>
              </div>

              <div className="stat-card">
                <div className="stat-number">250+</div>
                <div className="stat-label">Institutional Colleges</div>
                <p className="stat-subtext">Empowered by automated onboarding.</p>
              </div>

              <div className="stat-card">
                <div className="stat-number">3K+</div>
                <div className="stat-label">Whiteboard Topic Graphs</div>
                <p className="stat-subtext">Connecting proofs, equations, and lab theory.</p>
              </div>

              <div className="stat-card">
                <div className="stat-number">+99.4%</div>
                <div className="stat-label">Verified Integrity Rate</div>
                <p className="stat-subtext">Ensured through live proctoring & quiz checks.</p>
              </div>
            </div>

          </div>

          {/* Horizontal Dashed Divider */}
          <div className="hero-dashed-divider" aria-hidden="true" />

          {/* 5. What is the Problem & How We Solve It Section (Title on the Right) */}
          <div className="hero-problem-solution-section" id="features">
            <div className="ps-layout-grid">
              
              {/* Left Column: Visual Problem vs Solution Comparison Matrix Card */}
              <div className="ps-visual-col">
                <div className="ps-matrix-card">
                  
                  {/* Card Header */}
                  <div className="ps-matrix-header">
                    <span className="ps-header-badge">EVALUATION PARADIGM SHIFT</span>
                    <span className="ps-status-pill">● Verified Shift</span>
                  </div>

                  {/* Problem Block (Traditional System) */}
                  <div className="ps-contrast-box ps-problem-box">
                    <div className="ps-box-head">
                      <span className="ps-box-icon ps-problem-icon">✕</span>
                      <div className="ps-box-info">
                        <h4 className="ps-box-title">The Core Problem</h4>
                        <span className="ps-box-subtitle">Superficial Cramming & Unverified Submissions</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Bridge Indicator */}
                  <div className="ps-bridge-indicator">
                    <span className="ps-bridge-arrow">▼</span>
                    <span className="ps-bridge-label">EduGraph Architecture</span>
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
                    </div>
                  </div>

                  {/* Footer Metric Banner */}
                  <div className="ps-matrix-footer">
                    <div className="ps-footer-stat">
                      <span className="ps-stat-highlight">0%</span>
                      <span className="ps-stat-sub">Plagiarism</span>
                    </div>
                    <div className="ps-footer-divider" />
                    <div className="ps-footer-stat">
                      <span className="ps-stat-highlight">+3.8x</span>
                      <span className="ps-stat-sub">Retention</span>
                    </div>
                    <div className="ps-footer-divider" />
                    <div className="ps-footer-stat">
                      <span className="ps-stat-highlight">99.4%</span>
                      <span className="ps-stat-sub">Integrity</span>
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
                  Replacing passive rote recall with interactive whiteboard graphs and continuous anti-cheat verification.
                </p>

                <div className="ps-pillars-list">
                  <div className="ps-pillar-item">
                    <div className="pillar-num-badge">01</div>
                    <div className="pillar-content">
                      <strong>Visual Knowledge Construction</strong>
                      <p>Transform formulas and principles into dynamic whiteboard node networks.</p>
                    </div>
                  </div>

                  <div className="ps-pillar-item">
                    <div className="pillar-num-badge">02</div>
                    <div className="pillar-content">
                      <strong>Proctored Academic Integrity</strong>
                      <p>Page visibility monitoring and immediate 20-MCQ comprehension validation.</p>
                    </div>
                  </div>

                  <div className="ps-pillar-item">
                    <div className="pillar-num-badge">03</div>
                    <div className="pillar-content">
                      <strong>Real-Time Classroom Telemetry</strong>
                      <p>Instant visual mastery indicators and concept retention analytics for faculty.</p>
                    </div>
                  </div>
                </div>

                <div className="ps-action-badges">
                  <a href="#features" className="v-pill v-pill-link">Explore Detailed Features →</a>
                  <a href="#contact" className="v-pill v-pill-link">Request Campus Demo →</a>
                </div>
              </div>

            </div>
          </div>

          {/* Horizontal Dashed Divider */}
          <div className="hero-dashed-divider" aria-hidden="true" />

          {/* 6. How EduGraph Works ? Section (Big Whiteboard with Non-Spaghetti Workflow) */}
          <div className="hero-hiw-section" id="how-it-works">
            
            {/* Section Header */}
            <div className="hiw-header-block">
              <span className="section-eyebrow">End-to-End System Workflow</span>
              <h2 className="hiw-title">How EduGraph Works ?</h2>
              <div className="hiw-sketch-divider" aria-hidden="true" />
              <p className="hiw-desc">
                A structured, fraud-proof learning pipeline connecting visual node ideation, live integrity tracking, and automated conceptual validation.
              </p>
            </div>

            {/* Big Edudraw Whiteboard Canvas */}
            <div className="hiw-whiteboard-card">
              
              {/* Whiteboard Window Header & Controls */}
              <div className="hiw-wb-header">
                <div className="hiw-wb-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-amber" />
                  <span className="dot dot-green" />
                </div>
                
                <div className="hiw-wb-title-box">
                  <span className="hiw-wb-title">EduGraph Interactive Whiteboard Canvas</span>
                  <span className="hiw-wb-badge">WORKFLOW PIPELINE v2.4</span>
                </div>

                <div className="hiw-wb-tools">
                  <span className="hiw-tool-btn active" title="Pointer Select">↖ Select</span>
                  <span className="hiw-tool-btn" title="Concept Node">▢ Nodes</span>
                  <span className="hiw-tool-btn" title="Flow Connectors">⇄ Arrows</span>
                  <span className="hiw-tool-btn" title="Integrity Shield"><IconShield size={13} color="#1B7F72" /> Shield</span>
                  <span className="hiw-tool-btn hiw-zoom-pill">100%</span>
                </div>
              </div>

              {/* Whiteboard Canvas Main Board (Dot-Grid Background) */}
              <div className="hiw-wb-canvas">
                
                {/* Top Status Bar Inside Whiteboard */}
                <div className="hiw-canvas-meta-bar">
                  <div className="hiw-meta-left">
                    <span className="hiw-live-pulse" />
                    <span className="hiw-meta-text">Sequential Execution Pipeline • Non-Spaghetti Architecture</span>
                  </div>
                  <div className="hiw-meta-right">
                    <span className="hiw-meta-chip">Directional Flow ➔</span>
                  </div>
                </div>

                {/* 4-Stage Connected Workflow Grid */}
                <div className="hiw-workflow-stream">

                  {/* Stage 1: Faculty Blueprint */}
                  <div className="hiw-stage-node stage-faculty">
                    <div className="stage-step-tag">STEP 01</div>
                    <div className="stage-card-icon"><IconInstitution size={28} color="#1B7F72" /></div>
                    <h3 className="stage-title">Faculty Assignment</h3>
                    <p className="stage-sub">Professors define syllabus concept graphs and anti-cheat thresholds.</p>
                    
                    <div className="stage-micro-box">
                      <span className="micro-dot dot-navy" />
                      <span>Topic Blueprint Initialized</span>
                    </div>
                  </div>

                  {/* Connector 1 -> 2 */}
                  <div className="hiw-stream-connector">
                    <div className="connector-line-wrapper">
                      <svg viewBox="0 0 100 24" className="stream-arrow-svg" preserveAspectRatio="none">
                        <line x1="0" y1="12" x2="88" y2="12" stroke="#1B7F72" strokeWidth="2.5" strokeDasharray="5 4" />
                        <polygon points="86,6 98,12 86,18" fill="#1B7F72" />
                      </svg>
                    </div>
                    <span className="connector-pill-label">1. Dispatched ➔</span>
                  </div>

                  {/* Stage 2: Student Edudraw Canvas */}
                  <div className="hiw-stage-node stage-student">
                    <div className="stage-step-tag stage-tag-teal">STEP 02</div>
                    <div className="stage-card-icon"><IconBrain size={28} color="#10233F" /></div>
                    <h3 className="stage-title">Spatial Mind Graph</h3>
                    <p className="stage-sub">Students visually construct interlinked equations, proofs, and theory nodes.</p>
                    
                    {/* Branching Sub-Nodes Demo */}
                    <div className="stage-subnodes-cluster">
                      <div className="cluster-node">Proof A</div>
                      <span className="cluster-link">⇄</span>
                      <div className="cluster-node">Equation B</div>
                    </div>

                    <div className="stage-sticky-note">
                      <span className="sticky-pin"><IconPin size={13} color="#C6822E" /></span>
                      <span>Requires relational comprehension!</span>
                    </div>
                  </div>

                  {/* Connector 2 -> 3 */}
                  <div className="hiw-stream-connector">
                    <div className="connector-line-wrapper">
                      <svg viewBox="0 0 100 24" className="stream-arrow-svg" preserveAspectRatio="none">
                        <line x1="0" y1="12" x2="88" y2="12" stroke="#C6822E" strokeWidth="2.5" strokeDasharray="5 4" />
                        <polygon points="86,6 98,12 86,18" fill="#C6822E" />
                      </svg>
                    </div>
                    <span className="connector-pill-label label-amber">2. Monitored ➔</span>
                  </div>

                  {/* Stage 3: Live Anti-Cheat Proctoring */}
                  <div className="hiw-stage-node stage-security">
                    <div className="stage-step-tag stage-tag-amber">STEP 03</div>
                    <div className="stage-card-icon"><IconShield size={28} color="#C6822E" /></div>
                    <h3 className="stage-title">Proctor Shield</h3>
                    <p className="stage-sub">Real-time page visibility and tab tracking halt unauthorized external assistance.</p>
                    
                    <div className="stage-security-feed">
                      <span className="feed-status-good">✓ 0 Tab Switches</span>
                      <span className="feed-status-good">✓ 100% Window Focus</span>
                    </div>

                    <div className="stage-sticky-note note-security">
                      <span className="sticky-pin"><IconBolt size={13} color="#C6822E" /></span>
                      <span>Zero tolerance for external copy-paste</span>
                    </div>
                  </div>

                  {/* Connector 3 -> 4 */}
                  <div className="hiw-stream-connector">
                    <div className="connector-line-wrapper">
                      <svg viewBox="0 0 100 24" className="stream-arrow-svg" preserveAspectRatio="none">
                        <line x1="0" y1="12" x2="88" y2="12" stroke="#16A34A" strokeWidth="2.5" strokeDasharray="5 4" />
                        <polygon points="86,6 98,12 86,18" fill="#16A34A" />
                      </svg>
                    </div>
                    <span className="connector-pill-label label-green">3. Validate ➔</span>
                  </div>

                  {/* Stage 4: Instant 20-MCQ Verification & Mastery */}
                  <div className="hiw-stage-node stage-verification">
                    <div className="stage-step-tag stage-tag-green">STEP 04</div>
                    <div className="stage-card-icon"><IconTarget size={28} color="#16A34A" /></div>
                    <h3 className="stage-title">Mastery Validation</h3>
                    <p className="stage-sub">Post-submission 20-MCQ quiz verifies author authentic understanding.</p>
                    
                    <div className="stage-score-card">
                      <div className="score-val">20/20</div>
                      <span className="score-badge">✓ Verified & Graded</span>
                    </div>
                  </div>

                </div>

                {/* Return Loop / Telemetry Feedback Loop Banner */}
                <div className="hiw-return-loop-banner">
                  <div className="loop-indicator-track">
                    <span className="loop-icon"><IconRefresh size={16} color="#1B7F72" /></span>
                    <span className="loop-text">
                      <strong>Institutional Telemetry Loop:</strong> Verified grades & comprehension heatmaps automatically sync to College Principal & Faculty Dashboards.
                    </span>
                  </div>
                  <span className="loop-audit-pill">● Tamper-Proof Audit Trail</span>
                </div>

              </div>

              {/* Whiteboard Footer Bar */}
              <div className="hiw-wb-footer">
                <div className="wb-footer-left">
                  <span className="status-indicator-live">● Whiteboard Engine Operational</span>
                  <span className="wb-footer-stats">4 Sequential Stages • 8 Node Anchors • Clean Pipeline</span>
                </div>
                <div className="wb-footer-right">
                  <a href="#features" className="wb-footer-link">View Whiteboard Docs →</a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  )
}