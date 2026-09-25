import React, { useState, useEffect, useRef } from 'react'
import { Excalidraw, exportToBlob, exportToSvg, serializeAsJSON } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import './EduWhiteboard.css'

/**
 * EduWhiteboard: Complete Excalidraw integration component for EduGraph
 * Exposes all native features:
 * - Freehand drawing, geometric shapes, arrows, lines, text, libraries, images
 * - Full styling controls (roughness, stroke width, colors, fill patterns, fonts)
 * - Built-in undo/redo, zoom, pan, grid, theme toggle, and export (PNG, SVG, JSON)
 * - Seamless serialization to and from backend excalidrawDrawingData
 */
export default function EduWhiteboard({
  initialData = null,
  onChange = null,
  viewModeEnabled = false,
  zenModeEnabled = false,
  gridModeEnabled = false,
  theme = 'light',
  name = 'edugraph-whiteboard',
  onApiLoaded = null,
  customHeader = null,
  height = '100%',
  width = '100%',
}) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const isLoadedRef = useRef(false)

  // Notify parent of API instance
  const handleApi = (api) => {
    setExcalidrawAPI(api)
    if (onApiLoaded) onApiLoaded(api)
  }

  // Load initialData when API is ready
  useEffect(() => {
    if (!excalidrawAPI || !initialData) return

    try {
      let parsed = initialData
      if (typeof initialData === 'string') {
        parsed = JSON.parse(initialData)
      }

      if (parsed) {
        // If wrapped in custom structure or raw excalidraw scene
        const elements = parsed.elements || (Array.isArray(parsed) ? parsed : [])
        const appState = parsed.appState || {}
        const files = parsed.files || {}

        excalidrawAPI.updateScene({
          elements,
          appState: {
            ...appState,
            viewModeEnabled: viewModeEnabled ?? appState.viewModeEnabled ?? false,
          },
        })

        if (files && Object.keys(files).length > 0) {
          excalidrawAPI.addFiles(Object.values(files))
        }
      }
    } catch (e) {
      console.warn('EduWhiteboard: Could not parse initialData as Excalidraw scene JSON:', e)
    }
  }, [excalidrawAPI, initialData, viewModeEnabled])

  // Parse initial scene for Excalidraw initialData prop if available
  const parsedInitialData = React.useMemo(() => {
    if (!initialData) return undefined
    try {
      const data = typeof initialData === 'string' ? JSON.parse(initialData) : initialData
      return {
        elements: data.elements || (Array.isArray(data) ? data : []),
        appState: {
          ...(data.appState || {}),
          viewModeEnabled,
          zenModeEnabled,
          gridModeEnabled,
          theme,
        },
        files: data.files || {},
      }
    } catch {
      return undefined
    }
  }, [initialData, viewModeEnabled, zenModeEnabled, gridModeEnabled, theme])

  const handleSceneChange = (elements, appState, files) => {
    if (onChange) {
      onChange({ elements, appState, files })
    }
  }

  return (
    <div className="edu-whiteboard-wrapper" style={{ height, width }}>
      {customHeader && <div className="edu-whiteboard-custom-header">{customHeader}</div>}
      <div className="edu-whiteboard-canvas-holder">
        <Excalidraw
          excalidrawAPI={handleApi}
          initialData={parsedInitialData}
          onChange={handleSceneChange}
          viewModeEnabled={viewModeEnabled}
          zenModeEnabled={zenModeEnabled}
          gridModeEnabled={gridModeEnabled}
          theme={theme}
          name={name}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: true,
              clearCanvas: !viewModeEnabled,
              export: {
                saveFileToDisk: true,
              },
              loadScene: !viewModeEnabled,
              saveToActiveFile: false,
              theme: true,
              saveAsImage: true,
            },
          }}
        />
      </div>
    </div>
  )
}

/**
 * Utility helper to export an Excalidraw scene to PNG Blob
 */
export async function exportSceneToPngBlob(elements, appState, files) {
  return await exportToBlob({
    elements,
    appState: {
      ...appState,
      exportWithDarkMode: false,
      exportBackground: true,
    },
    files,
    mimeType: 'image/png',
  })
}

/**
 * Utility helper to export an Excalidraw scene to SVG element
 */
export async function exportSceneToSvg(elements, appState, files) {
  return await exportToSvg({
    elements,
    appState,
    files,
  })
}

/**
 * Utility helper to serialize current scene for saving to database
 */
export function serializeSceneData(elements, appState, files) {
  return JSON.stringify({
    elements: elements || [],
    appState: {
      viewBackgroundColor: appState?.viewBackgroundColor || '#ffffff',
      gridSize: appState?.gridSize || null,
    },
    files: files || {},
    savedAt: new Date().toISOString(),
  })
}
