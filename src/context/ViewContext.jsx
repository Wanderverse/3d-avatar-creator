import React, { createContext, useEffect, useState } from 'react'

export const CameraMode = {
  NORMAL: 'NORMAL',
  AR: 'AR',
  AR_FRONT: 'AR_FRONT',
  VR: 'VR',
}

export const ViewMode = {
  LANDING: 'LANDING',
  CREATE: 'CREATE',
  LOAD: 'LOAD',
  APPEARANCE: 'APPEARANCE',
  BIO: 'BIO',
  SAVE: 'SAVE',
  MINT: 'MINT',
  CHAT: 'CHAT',
}

export const ViewContext = createContext()

export const ViewProvider = (props) => {
  const [currentCameraMode, setCurrentCameraMode] = React.useState(CameraMode.NORMAL)
  const [viewMode, setViewMode] = React.useState(ViewMode.LANDING)
  const [isLoading, setIsLoading] = React.useState(false)
  const [mouseIsOverUI, setMouseIsOverUI] = React.useState(false)

  console.log(viewMode)

  return (
    <ViewContext.Provider
      value={{
        viewMode,
        setViewMode,
        isLoading,
        setIsLoading,
        mouseIsOverUI,
        setMouseIsOverUI,
        currentCameraMode,
        setCurrentCameraMode,
      }}
    >
      {props.children}
    </ViewContext.Provider>
  )
}
