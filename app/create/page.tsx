'use client'
import React, { useEffect, useState } from 'react'
import styles from './Create.module.css'
import { ViewMode, ViewContext } from '@/context/ViewContext'
import CustomButton from '@/components/custom-button'
import { LanguageContext } from '@/context/LanguageContext'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'

import { SoundContext } from '@/context/SoundContext'
import { AudioContext } from '@/context/AudioContext'
import { SceneContext } from '@/context/SceneContext'
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

function Create(props) {
  const { initialManifest, personality, sceneModel, blinkManager, lookatManager, effectManager } = resource.read()

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
  } = useContext(SceneContext) // Translate hook
  const { t } = useContext(LanguageContext)
  const [animationManager, setAnimationManager] = useState({})

  const { setViewMode } = React.useContext(ViewContext)
  const { playSound } = React.useContext(SoundContext)
  const { isMute } = React.useContext(AudioContext)
  const router = useRouter()

  useEffect(() => {
    setManifest(initialManifest)
  }, [initialManifest])

  const fetchNewModel = (index) => {
    //setManifest(manifest)
    setAwaitDisplay(true)
    resetAvatar()
    return new Promise((resolve) => {
      asyncResolve()
      async function asyncResolve() {
        const animManager = await fetchAnimation(manifest[index])
        console.log('animManager', animManager)
        console.log('manifest', manifest[index])
        setAnimationManager(animManager)
        setTemplateInfo(manifest[index])
        resolve(manifest[index])
      }
    })
  }

  const back = () => {
    setViewMode(ViewMode.LANDING)
    !isMute && playSound('backNextButton')
  }

  const selectClass = (characterClass) => {
    fetchNewModel(characterClass.templateIndex).then((r) => {
      setViewMode(ViewMode.APPEARANCE)
    })
    !isMute && playSound('classSelect')
    router.push('/configurator')
  }
  const hoverClass = () => {
    !isMute && playSound('classMouseOver')
  }

  const classes = [
    // {
    //   name: t("classes.beastPainter.name"),
    //   image: "/assets/media/disabled.png",
    //   description: t("classes.beastPainter.description"),
    //   icon: "/assets/icons/class-beast-painter.svg",
    //   disabled: true,
    //   templateIndex: 2,
    // },
    // {
    //   name: t("classes.engineer.name"),
    //   image: "/assets/media/disabled.png",
    //   description: t("classes.engineer.description"),
    //   icon: "/assets/icons/class-engineer.svg",
    //   disabled: false,
    //   templateIndex: 3,
    // },
    {
      name: t('classes.dropHunter.name'),
      image: '/assets/media/DropHunter.png',
      description: t('classes.dropHunter.description'),
      icon: '/assets/icons/class-drop-hunter.svg',
      disabled: false,
      templateIndex: 0,
    },
    {
      name: t('classes.theDegen.name'),
      image: '/assets/media/degens.gif',
      description: t('classes.theDegen.description'),
      icon: '/assets/icons/class-the-degen.svg',
      disabled: true,
      templateIndex: 6,
    },
    {
      name: t('classes.neuralHacker.name'),
      image: '/assets/media/NeuralHacker.png',
      description: t('classes.neuralHacker.description'),
      icon: '/assets/icons/class-neural-hacker.svg',
      disabled: false,
      templateIndex: 1,
    },
    {
      name: t('classes.liskWitch.name'),
      image: '/assets/media/disabled.png',
      description: t('classes.liskWitch.description'),
      icon: '/assets/icons/class-lisk-witch.svg',
      disabled: true,
      templateIndex: 4,
    },
    {
      name: t('classes.bruiser.name'),
      image: '/assets/media/disabled.png',
      description: t('classes.bruiser.description'),
      icon: '/assets/icons/class-bruiser.svg',
      disabled: true,
      templateIndex: 5,
    },
  ]

  return (
    <div className={`${styles.container} horizontalScroll`}>
      <div className={'sectionTitle'}>{t('pageTitles.chooseClass')}</div>
      <div className={styles.topLine} />
      <div className={styles.classContainer}>
        {classes.map((characterClass, i) => {
          return (
            <div
              key={i}
              className={!characterClass['disabled'] ? styles.class : styles.classdisabled}
              onClick={characterClass['disabled'] ? null : () => selectClass(characterClass)}
              onMouseOver={characterClass['disabled'] ? null : () => hoverClass()}
            >
              <div
                className={styles.classFrame}
                style={{
                  backgroundImage: `url(${characterClass['image']})`,
                }}
              >
                <div className={styles.frameContainer}>
                  <img src={'/assets/backgrounds/class-frame.svg'} className={styles.frame} />
                </div>

                <div className={styles.lockedContainer}>
                  {characterClass['disabled'] && <img src={'/assets/icons/locked.svg'} className={styles.locked} />}
                </div>
              </div>
              <div className={styles.icon}>
                <img src={characterClass['icon']} alt={characterClass['name']} />
              </div>

              <div className={styles.name}>{characterClass['name']}</div>
              <div className={styles.description}>{characterClass['description']}</div>
            </div>
          )
        })}
      </div>

      <div className={styles.bottomLine} />
      <div className={styles.buttonContainer}>
        {/* <CustomButton
          theme="light"
          text={t('callToAction.back')}
          size={14}
          className={styles.buttonLeft}
          onClick={back}
      /> */}
      </div>
    </div>
  )
}

export default Create
