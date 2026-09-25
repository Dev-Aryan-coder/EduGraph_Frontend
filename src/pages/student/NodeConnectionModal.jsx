import React, { useState } from 'react'
import studentService from '../../services/studentService'
import { IconLink, IconX, IconCheck } from '../../components/common/Icons'
import './NodeConnectionModal.css'

export default function NodeConnectionModal({
  sourceNode,
  availableNodes = [],
  isOpen,
  onClose,
  onConnected
}) {
  const [targetNodeId, setTargetNodeId] = useState('')
  const [label, setLabel] = useState('Relates to')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen || !sourceNode) return null

  // Filter out the source node itself
  const selectableNodes = availableNodes.filter(n => n.id !== sourceNode.id)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!targetNodeId) {
      setErrorMessage('Please select a target topic node to link.')
      return
    }

    setIsSubmitting(true)
    try {
      await studentService.linkNodes(sourceNode.id, {
        targetNodeId: Number(targetNodeId),
        label
      })
      if (onConnected) onConnected()
      onClose()
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to link nodes. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="conn-modal-card">
        <div className="conn-modal-header">
          <div className="conn-title-wrap">
            <div className="conn-icon-box">
              <IconLink size={20} color="#0D9488" />
            </div>
            <div>
              <h3>Connect Concept Nodes</h3>
              <p>Link <strong>{sourceNode.title}</strong> to another topic in this panel</p>
            </div>
          </div>
          <button className="conn-btn-close" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="conn-alert-error">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="conn-form">
          <div className="conn-form-group">
            <label className="conn-label">Target Concept Node *</label>
            <select
              className="conn-select"
              value={targetNodeId}
              onChange={(e) => setTargetNodeId(e.target.value)}
              required
            >
              <option value="">-- Choose destination node --</option>
              {selectableNodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.title} {node.description ? `(${node.description.slice(0, 30)}...)` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="conn-form-group">
            <label className="conn-label">Relationship Description *</label>
            <div className="conn-pills">
              {['Relates to', 'Prerequisite of', 'Subtopic of', 'Alternative to', 'Derived from'].map(p => (
                <button
                  type="button"
                  key={p}
                  className={`conn-pill ${label === p ? 'active' : ''}`}
                  onClick={() => setLabel(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <input
              type="text"
              className="conn-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Or type a custom relationship label..."
              required
            />
          </div>

          <div className="conn-actions">
            <button type="button" className="conn-btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="conn-btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Linking Nodes...' : (
                <>
                  <IconCheck size={16} /> Link Concept Nodes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}