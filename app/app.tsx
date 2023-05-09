import React, { Fragment, useContext, useEffect, useState } from 'react'
import { SceneContext } from '../context/SceneContext'
import { LanguageContext } from '../context/LanguageContext'
import { ViewMode, ViewContext } from '../context/ViewContext'
import { fetchAll, fetchNewModel } from '../utils/fetchFunctions'
import { updateCameraPosition } from '../utils/cameraFunctions'
import Scene from './Scene'
import Background from './Background'
import LanguageSwitch from './LanguageSwitch'

import dynamic from 'next/dynamic'

const Landing = dynamic(() => import('../pages/Landing'))
const Appearance = dynamic(() => import('../pages/Appearance'))
const BioPage = dynamic(() => import('../pages/Bio'))
const Create = dynamic(() => import('../pages/Create'))
const Load = dynamic(() => import('../pages/Load'))
const Save = dynamic(() => import('../pages/Save'))
const ViewPage = dynamic(() => import('../pages/View'))

const resource = fetchAll()

const App: React.FC = () => {
  const { initialManifest, personality, sceneModel, blinkManager, lookatManager, effectManager } = resource.read()

  const [hideUi, setHideUi] = useState(false)
  const [animationManager, setAnimationManager] = useState({})

  const {
    camera,
    controls,
    scene,
    resetAvatar,
    setAwaitDisplay,
    setTemplateInfo,
    templateInfo,
    moveCamera,
    setManifest,
    manifest,
  } = useContext(SceneContext)
  const { viewMode } = useContext(ViewContext)

  effectManager.camera = camera
  effectManager.scene = scene

  const fetchModel = (index: number) => {
    //setManifest(manifest)
    setAwaitDisplay(true)
    resetAvatar()
    return new Promise((resolve) => {
      asyncResolve()
      async function asyncResolve() {
        const animManager = await fetchNewModel(manifest[index])
        setAnimationManager(animManager)
        setTemplateInfo(manifest[index])
        resolve(manifest[index])
      }
    })
  }

  // map current app mode to a page
  const pages = {
    [ViewMode.LANDING]: <Landing />,
    [ViewMode.APPEARANCE]: (
      <Appearance
        animationManager={animationManager}
        blinkManager={blinkManager}
        lookatManager={lookatManager}
        effectManager={effectManager}
        fetchNewModel={fetchModel}
      />
    ),
    [ViewMode.BIO]: <BioPage templateInfo={templateInfo} personality={personality} />,
    [ViewMode.CREATE]: <Create fetchNewModel={fetchModel} />,
    [ViewMode.LOAD]: <Load />,
    [ViewMode.SAVE]: <Save />,
    [ViewMode.CHAT]: <ViewPage templateInfo={templateInfo} />,
  }

  let lastTap = 0
  useEffect(() => {
    const handleTap = (e: any) => {
      const now = new Date().getTime()
      const timesince = now - lastTap
      if (timesince < 300 && timesince > 10) {
        const tgt = e.target
        if (tgt.id === 'editor-scene') setHideUi(!hideUi)
      }
      lastTap = now
    }
    window.addEventListener('touchend', handleTap)
    window.addEventListener('click', handleTap)
    return () => {
      window.removeEventListener('touchend', handleTap)
      window.removeEventListener('click', handleTap)
    }
  }, [hideUi])

  useEffect(() => {
    updateCameraPosition(viewMode, effectManager, moveCamera, controls)
    if ([ViewMode.BIO, ViewMode.MINT, ViewMode.CHAT].includes(viewMode)) {
      lookatManager.enabled = false
    } else {
      lookatManager.enabled = true
    }
    window.addEventListener('resize', () => updateCameraPosition(viewMode, effectManager, moveCamera, controls))
    return () => {
      window.removeEventListener('resize', () => updateCameraPosition(viewMode, effectManager, moveCamera, controls))
    }
  }, [viewMode])

  useEffect(() => {
    setManifest(initialManifest)
  }, [initialManifest])

  // Translate hook
  const { t } = useContext(LanguageContext)

  return (
    <Fragment>
      <div className='generalTitle'>Wanderer Studio</div>
      <LanguageSwitch />
      <Background />
      <Scene manifest={manifest} sceneModel={sceneModel} lookatManager={lookatManager} />
      {pages[viewMode]}
    </Fragment>
  )
}

export default App
