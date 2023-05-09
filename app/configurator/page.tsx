'use client'
import React, { useContext, useEffect, useState } from 'react'
import styles from './Configurator.module.css'
import { ViewMode, ViewContext } from '@/context/ViewContext'
import { SceneContext } from '@/context/SceneContext'
import Editor from '@/components/editor/Editor'
import CustomButton from '@/components/custom-button'
import { LanguageContext } from '@/context/LanguageContext'
import { SoundContext } from '@/context/SoundContext'
import { AudioContext } from '@/context/AudioContext'
import { fetchAll, fetchAnimation } from '@/utils/fetchFunctions'

const fetchData = () => {
  let status, result

  const manifestPromise = fetchAll()
  // const modelPromise = fetchModel()
  const suspender = manifestPromise.then(
    (r) => {
      status = 'success'
      result = r
    },
    (e) => {
      status = 'error'
      result = e
    },
  )

  return {
    read() {
      if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
      throw suspender
    },
  }
}

const resource = fetchData()

function Appearance({}) {
  const { initialManifest, personality, sceneModel, blinkManager, lookatManager, effectManager } = resource.read()

  const [animationManager, setAnimationManager] = useState({})

  const { isLoading, setViewMode } = React.useContext(ViewContext)
  const {
    resetAvatar,
    getRandomCharacter,
    isChangingWholeAvatar,
    setIsChangingWholeAvatar,
    setAwaitDisplay,
    setTemplateInfo,
    manifest,
  } = React.useContext(SceneContext)

  const { playSound } = React.useContext(SoundContext)
  const { isMute } = React.useContext(AudioContext)
  const back = () => {
    !isMute && playSound('backNextButton')
    resetAvatar()
    setViewMode(ViewMode.CREATE)
  }

  const next = () => {
    !isMute && playSound('backNextButton')
    setViewMode(ViewMode.BIO)
  }

  const randomize = () => {
    if (!isChangingWholeAvatar) {
      !isMute && playSound('randomizeButton')
      getRandomCharacter()
    }
  }

  const fetchNewModel = (index) => {
    //setManifest(manifest)
    setAwaitDisplay(true)
    resetAvatar()
    return new Promise((resolve) => {
      asyncResolve()
      async function asyncResolve() {
        const animManager = await fetchAnimation(manifest[index])
        console.log('fetching animaton', animManager, manifest[index])
        setAnimationManager(animManager)
        setTemplateInfo(manifest[index])
        resolve(manifest[index])
      }
    })
  }

  useEffect(() => {
    const setIsChangingWholeAvatarFalse = () => setIsChangingWholeAvatar(false)

    effectManager.addEventListener('fadeintraitend', setIsChangingWholeAvatarFalse)
    effectManager.addEventListener('fadeinavatarend', setIsChangingWholeAvatarFalse)
    return () => {
      effectManager.removeEventListener('fadeintraitend', setIsChangingWholeAvatarFalse)
      effectManager.removeEventListener('fadeinavatarend', setIsChangingWholeAvatarFalse)
    }
  }, [])

  // Translate hook
  const { t } = useContext(LanguageContext)

  return (
    <div className={styles.container}>
      <div className={`loadingIndicator ${isLoading ? 'active' : ''}`}>
        <img className={'rotate'} src='ui/loading.svg' />
      </div>
      <div className={'sectionTitle'}>{t('pageTitles.chooseAppearance')}</div>
      <Editor
        animationManager={animationManager}
        blinkManager={blinkManager}
        lookatManager={lookatManager}
        effectManager={effectManager}
        fetchNewModel={fetchNewModel}
      />
      <div className={styles.buttonContainer}>
        <CustomButton
          theme='light'
          text={t('callToAction.back')}
          size={14}
          className={styles.buttonLeft}
          onClick={back}
        />
        <CustomButton
          theme='light'
          text={t('callToAction.next')}
          size={14}
          className={styles.buttonRight}
          onClick={next}
        />
        <CustomButton
          theme='light'
          text={t('callToAction.randomize')}
          size={14}
          className={styles.buttonCenter}
          onClick={randomize}
        />
      </div>
    </div>
  )
}

export default Appearance
