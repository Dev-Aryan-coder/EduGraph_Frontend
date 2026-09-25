import React from 'react'
import {
  IconInstitution,
  IconGraduation,
  IconPlug,
  IconChart,
  IconCode,
  IconFlask,
  IconCompass,
  IconTrending
} from '../../components/common/Icons'
import './Services.css'

export default function Services({ onNavigate }) {
  const navigateTo = (tab) => {
    if (onNavigate) {
      onNavigate(tab)
    } else {
      window.location.hash = `#${tab}`
    }
  }

  const serviceTiers = [
    {
      id: 'campus-deployment',
      number: '01',
      tag: 'SCALE & RELIABILITY',
      title: 'Enterprise Campus Deployment',
      desc: 'Seamless university-wide rollout with automated student-faculty credential cascades and custom institutional domain configuration.',
      features: [
        'Unlimited student & faculty licenses',
        'SAML 2.0 / Okta / Azure AD Single Sign-On',
        'Custom institutional branding & subdomain',
        'Dedicated 99.99% uptime SLA & disaster recovery'
      ],
      icon: <IconInstitution size={26} color="#1B7F72" />
    },
    {
      id: 'faculty-enablement',
      number: '02',
      tag: 'PEDAGOGICAL EXCELLENCE',
      title: 'Faculty Enablement & Onboarding',
      desc: 'Hands-on curriculum digitization workshops empowering professors to translate flat syllabi into interactive whiteboard knowledge graphs.',
      features: [
        '1-on-1 department coaching sessions',
        'Syllabus-to-graph blueprint conversion',
        'Curated 20-MCQ validation quiz repositories',
        'Accredited faculty certification program'
      ],
      icon: <IconGraduation size={26} color="#10233F" />
    },
    {
      id: 'lms-integration',
      number: '03',
      tag: 'SEAMLESS CONNECTIVITY',
      title: 'LMS & API Connectors (LTI 1.3)',
      desc: 'Plug-and-play synchronization with your existing learning management ecosystem and student information systems.',
      features: [
        'Certified LTI 1.3 Advantage integration',
        'Canvas, Blackboard, Moodle & Brightspace support',
        'Automated real-time gradebook synchronization',
        'REST API & Webhook data streaming'
      ],
      icon: <IconPlug size={26} color="#C6822E" />
    },
    {
      id: 'accreditation-audit',
      number: '04',
      tag: 'COMPLIANCE & INTEGRITY',
      title: 'Accreditation Telemetry & Audit',
      desc: 'Comprehensive visual learning analytics and tamper-proof student comprehension dossiers built for ABET, NAAC, and regional reviews.',
      features: [
        'Tamper-proof student mastery audit trails',
        'Cohort retention & concept decay telemetry',
        'Curricular outcome mapping reports',
        'FERPA, GDPR & SOC-2 compliance documentation'
      ],
      icon: <IconChart size={26} color="#16A34A" />
    }
  ]

  const departments = [
    {
      name: 'Engineering & Computing',
      icon: <IconCode size={24} color="#1B7F72" />,
      desc: 'Algorithm trace graphs, circuit topology models, distributed systems blueprints, and data structure visualizations.',
      topics: ['Data Structures', 'Circuit Theory', 'OS Kernels', 'Network Topologies']
    },
    {
      name: 'Physical & Natural Sciences',
      icon: <IconFlask size={24} color="#10233F" />,
      desc: 'Quantum state vectors, organic reaction mechanisms, biochemical metabolic pathways, and thermodynamics cycles.',
      topics: ['Quantum Optics', 'Reaction Pathways', 'Cellular Respiration', 'Fluid Dynamics']
    },
    {
      name: 'Mathematics & Proofs',
      icon: <IconCompass size={24} color="#C6822E" />,
      desc: 'Step-by-step theorem derivations, multivariable coordinate systems, topological manifolds, and linear algebra transformations.',
      topics: ['Real Analysis', 'Differential Geometry', 'Linear Transformations', 'Combinatorics']
    },
    {
      name: 'Business & Economics',
      icon: <IconTrending size={24} color="#16A34A" />,
      desc: 'Macroeconomic equilibrium topologies, supply chain dependency models, econometric flows, and financial decision trees.',
      topics: ['Market Equilibrium', 'Game Theory', 'Supply Chain Networks', 'Econometrics']
    }
  ]

  const roadmapSteps = [
    {
      week: 'WEEK 01',
      title: 'IT & SSO Provisioning',
      desc: 'Single Sign-On integration via SAML/Okta, domain whitelisting, and secure administrative credential cascading.'
    },
    {
      week: 'WEEK 02',
      title: 'Faculty Pilot & Blueprints',
      desc: 'Selected department champions design initial syllabus whiteboard graphs and anti-cheat validation thresholds.'
    },
    {
      week: 'WEEK 03',
      title: 'Student Canvas Onboarding',
      desc: 'Students receive guided Edudraw whiteboard training and practice low-stakes topological assignments.'
    },
    {
      week: 'WEEK 04',
      title: 'Campus-Wide Launch & Exam',
      desc: 'Full cohort deployment with live proctoring telemetry, instant 20-MCQ grading, and principal portal reporting.'
    }
  ]

  return (
    <div className="services-page-wrapper">
      
      {/* 1. Hero Section */}
      <section className="services-hero-section">
        <div className="services-hero-container">
          <div className="services-badge-pill">
            <span className="services-badge-dot" />
            <span>INSTITUTIONAL CAMPUS SOLUTIONS</span>
          </div>

          <h1 className="services-headline">
            Academic Services Built for <br className="hidden-mobile" />
            <span className="services-gradient-text">Higher-Ed Transformation</span>
          </h1>

          <div className="services-sketch-divider" aria-hidden="true" />

          <p className="services-subheadline">
            From single-department pilot programs to campus-wide LTI integrations and accredited faculty enablement, EduGraph partners with universities to deliver measurable conceptual mastery.
          </p>

          <div className="services-hero-metrics">
            <div className="s-metric-box">
              <span className="s-metric-num">250+</span>
              <span className="s-metric-lbl">Colleges Deployed</span>
            </div>
            <div className="s-metric-sep" />
            <div className="s-metric-box">
              <span className="s-metric-num">&lt; 4 Weeks</span>
              <span className="s-metric-lbl">Implementation Time</span>
            </div>
            <div className="s-metric-sep" />
            <div className="s-metric-box">
              <span className="s-metric-num">99.99%</span>
              <span className="s-metric-lbl">Platform SLA</span>
            </div>
            <div className="s-metric-sep" />
            <div className="s-metric-box">
              <span className="s-metric-num">100%</span>
              <span className="s-metric-lbl">LTI 1.3 Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Service Packages Grid */}
      <section className="services-grid-section">
        <div className="services-content-container">
          <div className="serv-section-header">
            <span className="section-eyebrow">OUR CORE CAPABILITIES</span>
            <h2 className="serv-section-title">Institutional Partnership Packages</h2>
            <p className="serv-section-desc">
              Tailored service tiers engineered to support institutions of every size—from regional engineering colleges to tier-1 research universities.
            </p>
          </div>

          <div className="service-packages-grid">
            {serviceTiers.map((tier) => (
              <div key={tier.id} className="service-package-card">
                <div className="tier-header-bar">
                  <span className="tier-number">{tier.number}</span>
                  <span className="tier-icon">{tier.icon}</span>
                </div>
                
                <span className="tier-tag">{tier.tag}</span>
                <h3 className="tier-title">{tier.title}</h3>
                <p className="tier-desc">{tier.desc}</p>

                <div className="tier-checklist">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="tier-feat-item">
                      <span className="check-bullet">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="tier-action-bar">
                  <button 
                    className="tier-cta-link"
                    onClick={() => navigateTo('contact')}
                  >
                    Request Package Details ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Departmental Solutions Section */}
      <section className="services-dept-section">
        <div className="services-content-container">
          <div className="serv-section-header">
            <span className="section-eyebrow">DISCIPLINARY EXCELLENCE</span>
            <h2 className="serv-section-title">Built for Every Academic Department</h2>
            <p className="serv-section-desc">
              How EduGraph’s topological whiteboards adapt to the unique representational needs of different university faculties.
            </p>
          </div>

          <div className="dept-cards-grid">
            {departments.map((dept, index) => (
              <div key={index} className="dept-card">
                <div className="dept-icon-circle">{dept.icon}</div>
                <h3 className="dept-name">{dept.name}</h3>
                <p className="dept-desc">{dept.desc}</p>

                <div className="dept-topics-list">
                  {dept.topics.map((t, idx) => (
                    <span key={idx} className="dept-topic-pill">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Implementation Roadmap (4 Weeks to Launch) */}
      <section className="services-roadmap-section">
        <div className="services-content-container">
          <div className="serv-section-header">
            <span className="section-eyebrow">RAPID TIME-TO-VALUE</span>
            <h2 className="serv-section-title">4-Week Campus Onboarding Roadmap</h2>
            <p className="serv-section-desc">
              Our structured onboarding methodology ensures seamless faculty adoption with minimal technical overhead.
            </p>
          </div>

          <div className="roadmap-timeline-grid">
            {roadmapSteps.map((step, idx) => (
              <div key={idx} className="roadmap-step-card">
                <div className="roadmap-week-badge">{step.week}</div>
                <h4 className="roadmap-title">{step.title}</h4>
                <p className="roadmap-desc">{step.desc}</p>
                <div className="roadmap-indicator-bar" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="services-cta-section">
        <div className="services-cta-card">
          <div className="cta-content">
            <span className="cta-badge">INSTITUTIONAL BRIEFING</span>
            <h2 className="cta-title">Schedule a Technical Consultation for Your Campus</h2>
            <p className="cta-desc">
              Our academic solutions directors will tailor an implementation roadmap and pilot scope for your college or university.
            </p>
            <div className="cta-actions-row">
              <button 
                className="serv-cta-btn primary"
                onClick={() => navigateTo('contact')}
              >
                Schedule Consultation →
              </button>
              <button 
                className="serv-cta-btn secondary"
                onClick={() => navigateTo('features')}
              >
                Review Platform Specifications
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}