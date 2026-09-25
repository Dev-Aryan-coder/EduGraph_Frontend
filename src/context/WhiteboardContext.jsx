import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const WhiteboardContext = createContext(null)

export function WhiteboardProvider({ children }) {
  // Panel and Graph Context
  const [activePanel, setActivePanel] = useState(null)
  const [panels, setPanels] = useState([])
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [activeNode, setActiveNode] = useState(null)

  // Canvas Drawing Settings
  const [canvasTool, setCanvasTool] = useState('pen') // 'pen' | 'eraser' | 'line' | 'rect' | 'circle' | 'arrow' | 'text'
  const [strokeColor, setStrokeColor] = useState('#0D9488')
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [zoom, setZoom] = useState(1.0)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // Undo / Redo History Stacks
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])

  /**
   * Capture a new canvas snapshot into undo history
   */
  const pushCanvasState = useCallback((canvas) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setUndoStack(prev => [...prev.slice(-20), imgData])
    setRedoStack([]) // Clear redo stack on new action
  }, [])

  /**
   * Undo the last canvas action
   */
  const undo = useCallback((canvas) => {
    if (!canvas || undoStack.length <= 1) return
    const ctx = canvas.getContext('2d')
    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height)

    setUndoStack(prev => {
      const nextUndo = [...prev]
      const targetState = nextUndo.pop() // Current state
      const prevState = nextUndo[nextUndo.length - 1] // State to restore
      if (prevState) {
        ctx.putImageData(prevState, 0, 0)
        setRedoStack(r => [...r, targetState])
      }
      return nextUndo
    })
  }, [undoStack])

  /**
   * Redo the previously undone action
   */
  const redo = useCallback((canvas) => {
    if (!canvas || redoStack.length === 0) return
    const ctx = canvas.getContext('2d')
    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height)

    setRedoStack(prev => {
      const nextRedo = [...prev]
      const stateToRestore = nextRedo.pop()
      if (stateToRestore) {
        ctx.putImageData(stateToRestore, 0, 0)
        setUndoStack(u => [...u, currentImg])
      }
      return nextRedo
    })
  }, [redoStack])

  /**
   * Clear the entire canvas and record undo snapshot
   */
  const clearCanvas = useCallback((canvas, bgColor = '#ffffff') => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    pushCanvasState(canvas)
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [pushCanvasState])

  /**
   * Export the current canvas as a high-resolution PNG file download
   */
  const exportAsPNG = useCallback((canvas, filename = 'edugraph-whiteboard.png') => {
    if (!canvas) return
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  /**
   * Serialize current knowledge graph and whiteboard drawing to JSON
   */
  const exportAsJSON = useCallback((canvas, extraMetadata = {}) => {
    const imageData = canvas ? canvas.toDataURL('image/png') : ''
    const payload = {
      panel: activePanel,
      nodes,
      connections,
      imageData,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      ...extraMetadata
    }
    return JSON.stringify(payload, null, 2)
  }, [activePanel, nodes, connections])

  /**
   * Import and restore whiteboard knowledge graph from JSON
   */
  const importFromJSON = useCallback((jsonString, canvas) => {
    try {
      const data = JSON.parse(jsonString)
      if (data.panel) setActivePanel(data.panel)
      if (Array.isArray(data.nodes)) setNodes(data.nodes)
      if (Array.isArray(data.connections)) setConnections(data.connections)

      if (data.imageData && canvas) {
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          pushCanvasState(canvas)
        }
        img.src = data.imageData
      }
      return true
    } catch (err) {
      console.error('Failed to parse whiteboard JSON:', err)
      return false
    }
  }, [pushCanvasState])

  /**
   * Local Node Helpers
   */
  const addNode = useCallback((node) => {
    setNodes(prev => [...prev, { ...node, id: node.id || Date.now() }])
  }, [])

  const updateNode = useCallback((id, updates) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))
  }, [])

  const removeNode = useCallback((id) => {
    setNodes(prev => prev.filter(n => n.id !== id))
    setConnections(prev => prev.filter(c => c.sourceNodeId !== id && c.targetNodeId !== id))
  }, [])

  /**
   * Local Connection Helpers
   */
  const addConnection = useCallback((sourceNodeId, targetNodeId, label = 'Relates to') => {
    setConnections(prev => [
      ...prev,
      {
        id: Date.now(),
        sourceNodeId,
        targetNodeId,
        label,
        createdAt: new Date().toISOString()
      }
    ])
  }, [])

  const removeConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId))
  }, [])

  /**
   * Reset studio state
   */
  const resetStudio = useCallback(() => {
    setActivePanel(null)
    setNodes([])
    setConnections([])
    setActiveNode(null)
    setUndoStack([])
    setRedoStack([])
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
  }, [])

  const value = {
    // Panel & Graph State
    activePanel,
    setActivePanel,
    panels,
    setPanels,
    nodes,
    setNodes,
    connections,
    setConnections,
    activeNode,
    setActiveNode,

    // Canvas Tools & Styles
    canvasTool,
    setCanvasTool,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    zoom,
    setZoom,
    pan,
    setPan,

    // Undo / Redo
    undoStack,
    redoStack,
    canUndo: undoStack.length > 1,
    canRedo: redoStack.length > 0,
    pushCanvasState,
    undo,
    redo,
    clearCanvas,

    // Import / Export
    exportAsPNG,
    exportAsJSON,
    importFromJSON,

    // Graph Operations
    addNode,
    updateNode,
    removeNode,
    addConnection,
    removeConnection,
    resetStudio
  }

  return (
    <WhiteboardContext.Provider value={value}>
      {children}
    </WhiteboardContext.Provider>
  )
}

export const useWhiteboard = () => {
  const context = useContext(WhiteboardContext)
  if (!context) {
    throw new Error('useWhiteboard must be used within a WhiteboardProvider')
  }
  return context
}

export default WhiteboardContext