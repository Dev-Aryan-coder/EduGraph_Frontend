import React from 'react'
import { IconArrowLeft, IconBrain } from '../../components/common/Icons'
import './NotFound.css'

export default function NotFound({ onNavigate }) {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-icon-wrap">
          <IconBrain size={56} color="#0D9488" />
        </div>
        <span className="not-found-code">404</span>
        <h2>Page Not Found</h2>
        <p>
          The page or academic workspace you are looking for does not exist or has been moved.
        </p>

        <div className="not-found-actions">
          <button
            className="btn-back-dashboard"
            onClick={() => onNavigate ? onNavigate('dashboard') : window.location.assign('#dashboard')}
          >
            <IconArrowLeft size={16} /> Return to Dashboard
          </button>
          <button
            className="btn-back-home"
            onClick={() => onNavigate ? onNavigate('home') : window.location.assign('#home')}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  )
}