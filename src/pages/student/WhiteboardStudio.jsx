import React, { useState, useEffect, useRef } from 'react'
import studentService from '../../services/studentService'
import NodeConnectionModal from './NodeConnectionModal'
import ShareNodeModal from './ShareNodeModal'
import EduWhiteboard from '../../components/whiteboard/EduWhiteboard'
import {
  IconArrowLeft,
  IconPlus,
  IconLink,
  IconShare,
  IconTrash,
  IconPencil,
  IconBrain,
  IconNodes,
  IconCheck,
  IconX,
  IconDownload
} from '../../components/common/Icons'
import './WhiteboardStudio.css'

export default function WhiteboardStudio({
  panelId,
  panelName,
  onBack
}) {
  const [activeTab, setActiveTab] = useState('excalidraw') // 'excalidraw' | 'nodes'
  const [nodes, setNodes] = useState([])
  const [connectionsMap, setConnectionsMap] = useState({}) // { [nodeId]: Connection[] }
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  // Excalidraw Whiteboard State
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const [panelDrawingData, setPanelDrawingData] = useState(null)

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingNode, setEditingNode] = useState(null)
  const [connectingSourceNode, setConnectingSourceNode] = useState(null)
  const [sharingItem, setSharingItem] = useState(null)

  // Node form state
  const [nodeTitle, setNodeTitle] = useState('')
  const [nodeDescription, setNodeDescription] = useState('')
  const [nodeContent, setNodeContent] = useState('')

  useEffect(() => {
    loadPanelNodes()
    loadPanelDrawing()
  }, [panelId])

  const loadPanelDrawing = () => {
    try {
      const stored = localStorage.getItem(`edugraph_panel_excalidraw_${panelId}`)
      if (stored) {
        setPanelDrawingData(JSON.parse(stored))
      }
    } catch (e) {
      console.warn('Could not load panel drawing data from localStorage:', e)
    }
  }

  const handleSaveExcalidraw = () => {
    if (!excalidrawAPI) return
    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()
      const files = excalidrawAPI.getFiles()
      const payload = {
        elements,
        appState: {
          viewBackgroundColor: appState?.viewBackgroundColor || '#ffffff',
          gridSize: appState?.gridSize || null,
        },
        files,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem(`edugraph_panel_excalidraw_${panelId}`, JSON.stringify(payload))
      setToastMessage('Excalidraw whiteboard saved successfully!')
      setTimeout(() => setToastMessage(''), 3000)
    } catch (e) {
      setErrorMessage('Failed to save whiteboard drawing.')
    }
  }

  const loadPanelNodes = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const nodeList = await studentService.getNodesForPanel(panelId)
      setNodes(nodeList)

      // Fetch connections for each node
      const connPromises = nodeList.map(async (n) => {
        try {
          const conns = await studentService.getConnections(n.id)
          return { nodeId: n.id, conns }
        } catch {
          return { nodeId: n.id, conns: [] }
        }
      })
      const results = await Promise.all(connPromises)
      const map = {}
      results.forEach(r => { map[r.nodeId] = r.conns })
      setConnectionsMap(map)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to load topic nodes.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenCreateModal = () => {
    setEditingNode(null)
    setNodeTitle('')
    setNodeDescription('')
    setNodeContent('')
    setIsCreateModalOpen(true)
  }

  const handleOpenEditModal = (node) => {
    setEditingNode(node)
    setNodeTitle(node.title || '')
    setNodeDescription(node.description || '')
    setNodeContent(node.content || '')
    setIsCreateModalOpen(true)
  }

  const handleSaveNode = async (e) => {
    e.preventDefault()
    if (!nodeTitle.trim()) return

    try {
      if (editingNode) {
        await studentService.updateNode(editingNode.id, {
          title: nodeTitle.trim(),
          description: nodeDescription.trim(),
          content: nodeContent.trim(),
          positionX: editingNode.positionX || 0,
          positionY: editingNode.positionY || 0
        })
      } else {
        await studentService.createNode(panelId, {
          title: nodeTitle.trim(),
          description: nodeDescription.trim(),
          content: nodeContent.trim(),
          positionX: Math.floor(Math.random() * 400),
          positionY: Math.floor(Math.random() * 400)
        })
      }
      setIsCreateModalOpen(false)
      loadPanelNodes()
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save node.')
    }
  }

  const handleDeleteNode = async (nodeId) => {
    if (!window.confirm('Are you sure you want to delete this concept node?')) return
    try {
      await studentService.deleteNode(nodeId)
      loadPanelNodes()
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete node.')
    }
  }

  const handleUnlink = async (sourceNodeId, connectionId) => {
    try {
      await studentService.deleteConnection(connectionId)
      loadPanelNodes()
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to remove connection.')
    }
  }

  return (
    <div className="wb-studio-container">
      {/* Top Application Bar */}
      <header className="wb-studio-header">
        <div className="wb-header-left">
          <button className="wb-back-btn" onClick={onBack}>
            <IconArrowLeft size={16} /> Back to Panels
          </button>
          <div className="wb-title-box">
            <span className="wb-sub-tag">Subject Whiteboard Studio</span>
            <h2>{panelName || 'Subject Knowledge Graph'}</h2>
          </div>
        </div>

        {/* View Switcher: Excalidraw vs Concept Nodes */}
        <div className="wb-mode-switcher">
          <button
            type="button"
            className={`mode-switch-btn ${activeTab === 'excalidraw' ? 'active' : ''}`}
            onClick={() => setActiveTab('excalidraw')}
          >
            <IconBrain size={16} />
            <span>Excalidraw Studio</span>
          </button>
          <button
            type="button"
            className={`mode-switch-btn ${activeTab === 'nodes' ? 'active' : ''}`}
            onClick={() => setActiveTab('nodes')}
          >
            <IconNodes size={16} />
            <span>Concept Nodes ({nodes.length})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="wb-header-right">
          {activeTab === 'excalidraw' ? (
            <button
              type="button"
              className="wb-action-btn btn-save-board"
              onClick={handleSaveExcalidraw}
            >
              <IconCheck size={16} /> Save Whiteboard
            </button>
          ) : (
            <button className="wb-action-btn btn-add" onClick={handleOpenCreateModal}>
              <IconPlus size={16} /> Add Topic Node
            </button>
          )}

          <button
            className="wb-action-btn btn-share"
            onClick={() => setSharingItem({ id: panelId, subjectName: panelName, type: 'panel' })}
          >
            <IconShare size={15} /> Share Panel
          </button>
        </div>
      </header>

      {errorMessage && (
        <div className="wb-alert-error">
          <span>{errorMessage}</span>
        </div>
      )}

      {toastMessage && (
        <div className="wb-alert-success">
          <IconCheck size={16} color="#16A34A" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Viewport */}
      {activeTab === 'excalidraw' ? (
        <div className="wb-excalidraw-container">
          <EduWhiteboard
            initialData={panelDrawingData}
            onApiLoaded={setExcalidrawAPI}
            name={`panel-${panelId}-${panelName || 'notes'}`}
            height="100%"
            width="100%"
          />
        </div>
      ) : (
        <main className="wb-canvas-area">
          {isLoading ? (
            <div className="wb-loading">
              <div className="quiz-spinner" />
              <p>Loading Knowledge Graph Nodes...</p>
            </div>
          ) : nodes.length === 0 ? (
            <div className="wb-empty-state">
              <div className="empty-icon-wrap">
                <IconNodes size={48} color="#0D9488" />
              </div>
              <h3>No Concept Nodes in this Subject Yet</h3>
              <p>
                Break down this subject into interconnected concept nodes, sketches, and revision notes.
              </p>
              <button className="wb-btn-primary" onClick={handleOpenCreateModal}>
                <IconPlus size={16} /> Create First Topic Node
              </button>
            </div>
          ) : (
            <div className="wb-nodes-grid">
              {nodes.map(node => {
                const conns = connectionsMap[node.id] || []
                return (
                  <div key={node.id} className="wb-node-card">
                    <div className="node-card-head">
                      <div className="node-title-wrap">
                        <span className="node-bullet" />
                        <h4>{node.title}</h4>
                      </div>
                      <div className="node-quick-actions">
                        <button
                          className="btn-icon"
                          title="Edit Node"
                          onClick={() => handleOpenEditModal(node)}
                        >
                          <IconPencil size={14} />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          title="Delete Node"
                          onClick={() => handleDeleteNode(node.id)}
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </div>

                    {node.description && (
                      <p className="node-desc">{node.description}</p>
                    )}

                    {node.content && (
                      <div className="node-notes-snippet">
                        <p>{node.content}</p>
                      </div>
                    )}

                    {/* Connected Links Strip */}
                    <div className="node-conns-section">
                      <span className="conns-label">Linked Concepts ({conns.length}):</span>
                      {conns.length === 0 ? (
                        <span className="no-conns">No connections yet</span>
                      ) : (
                        <div className="conns-pills-list">
                          {conns.map(c => (
                            <div key={c.id} className="conn-chip">
                              <span className="conn-chip-label">{c.label}:</span>
                              <span
                                className="conn-chip-target"
                                onClick={() => {
                                  const target = nodes.find(n => n.id === c.targetNodeId)
                                  if (target) handleOpenEditModal(target)
                                }}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                title="Click to view connected concept node"
                              >
                                {c.targetNodeTitle || `Node #${c.targetNodeId}`}
                              </span>
                              <button
                                className="conn-chip-remove"
                                onClick={() => handleUnlink(node.id, c.id)}
                                title="Unlink"
                              >
                                <IconX size={12} />
                              </button>
                            </div>
                          ))}
                        </div>

                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="node-card-footer">
                      <button
                        className="node-footer-btn"
                        onClick={() => setConnectingSourceNode(node)}
                      >
                        <IconLink size={13} /> Link
                      </button>
                      <button
                        className="node-footer-btn"
                        onClick={() => setSharingItem({ id: node.id, title: node.title, type: 'node' })}
                      >
                        <IconShare size={13} /> Share
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      )}

      {/* Create / Edit Node Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop">
          <div className="wb-node-modal">
            <div className="modal-header">
              <h3>{editingNode ? 'Edit Concept Node' : 'Create New Concept Node'}</h3>
              <button className="btn-close" onClick={() => setIsCreateModalOpen(false)}>
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNode} className="wb-node-form">
              <div className="form-group">
                <label>Node Title *</label>
                <input
                  type="text"
                  required
                  className="wb-input"
                  placeholder="e.g. Asynchronous I/O & Event Loops"
                  value={nodeTitle}
                  onChange={(e) => setNodeTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Brief Concept Description</label>
                <input
                  type="text"
                  className="wb-input"
                  placeholder="Short summary of this concept or module"
                  value={nodeDescription}
                  onChange={(e) => setNodeDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Detailed Study Content / Notes</label>
                <textarea
                  rows={4}
                  className="wb-textarea"
                  placeholder="Type detailed notes, key equations, or implementation details..."
                  value={nodeContent}
                  onChange={(e) => setNodeContent(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingNode ? 'Save Changes' : 'Create Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connect Nodes Modal */}
      {connectingSourceNode && (
        <NodeConnectionModal
          sourceNode={connectingSourceNode}
          allNodes={nodes}
          isOpen={true}
          onClose={() => setConnectingSourceNode(null)}
          onConnectionCreated={loadPanelNodes}
        />
      )}

      {/* Share Modal */}
      {sharingItem && (
        <ShareNodeModal
          isOpen={true}
          item={sharingItem}
          onClose={() => setSharingItem(null)}
        />
      )}
    </div>
  )
}