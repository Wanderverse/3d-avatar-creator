'use client'

import React from 'react'
import styles from './Background.module.sass'
import Spline from '@splinetool/react-spline'

import { ViewMode, ViewContext } from '@/context/ViewContext'

import { SoundContext } from '@/context/SoundContext'
import { AudioContext } from '@/context/AudioContext'

export function Background() {
  const { setViewMode } = React.useContext(ViewContext)
  const { playSound } = React.useContext(SoundContext)
  const { isMute } = React.useContext(AudioContext)

  function onClick(e) {
    console.log('test')
    if (e.target.name === 'icon') {
      console.log('I have been clicked!')
      setViewMode(ViewMode.CREATE)
      !isMute && playSound('backNextButton')
    }
  }
  return (
    <Spline
      onMouseUp={onClick}
      className={styles.videoBackground}
      scene='https://prod.spline.design/I270aSrgzqKeGwkd/scene.splinecode'
    />
  )
}
