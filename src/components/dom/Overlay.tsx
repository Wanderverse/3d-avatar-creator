'use client'
import React from 'react'
import styles from './Overlay.module.sass'

export function Overlay() {
  return (
    <div className={styles.overlayContainer}>
      <div className={styles.header}>
        <p className={styles.poimandres}>WANDERLAB</p>
        <div className={styles.flexSpacer}></div>
        <p className={styles.rightAlignedText}>⎑</p>
      </div>
      <div className={styles.height20}></div>
      <div className={styles.row}>
        <p className={styles.leftText}>
          <b>Metaverse Character Builder</b>
          <br />
          Imagine, Create, Wander
          <br />
          <b>—</b>
        </p>
        <div className={styles.width10}></div>
      </div>
      <div className={styles.height10}></div>
      <div className={styles.rowFullHeight} />

      <div className={styles.height20}></div>
      <div className={styles.pointerEvents}>
        <p className={styles.full}>
          <b>Wanderers of Wanderverse</b>
          <br />
          Where Imagination Meets Reality
        </p>
        <div className={styles.width10}></div>
        <div className={styles.width10}></div>
        <p className={styles.full} style={{ textAlign: 'right' }}></p>
      </div>
    </div>
  )
}
