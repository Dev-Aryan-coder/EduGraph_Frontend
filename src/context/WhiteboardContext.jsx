import React, { createContext, useContext, useState } from 'react'

const WhiteboardContext = createContext(null)

export function WhiteboardProvider({ children }) {
  const [activePanel, setActivePanel] = useState(null)
  return (
    <WhiteboardContext.Provider value={{ activePanel, setActivePanel }}>
      {children}
    </WhiteboardContext.Provider>
  )
}

export const useWhiteboard = () => useContext(WhiteboardContext)