import { PerspectiveCamera } from 'three'
import { EffectManager } from '@/library/effectManager'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ViewMode } from '@/context/ViewContext'
import * as THREE from 'three'

let cameraDistance
const centerCameraTarget = new THREE.Vector3()
const centerCameraPosition = new THREE.Vector3()
let centerCameraPositionLength
let ndcBias

const cameraDistanceChat = 1.4
const centerCameraTargetChat = new THREE.Vector3(0, 1.25, 0)
const centerCameraPositionChat = new THREE.Vector3(-0.9786403788721187, 1.4036900759197288, 0.9892635490125085) // note: get from `moveCamera({ targetY: 1.25, distance: 1.4 })`
const centerCameraPositionLengthChat = centerCameraPositionChat.length()
const ndcBiasChat = 0.35

const cameraDistanceOther = 3.2
const centerCameraTargetOther = new THREE.Vector3(0, 0.8, 0)
const centerCameraPositionOther = new THREE.Vector3(-2.2367993753934425, 1.1512971720174363, 2.2612065299409223) // note: get from `moveCamera({ targetY: 0.8, distance: 3.2 })`
const centerCameraPositionLengthOther = centerCameraPositionOther.length()
const ndcBiasOther = 0.5

const localVector3 = new THREE.Vector3()
const localVector4 = new THREE.Vector4()
const localVector4_2 = new THREE.Vector4()
const xAxis = new THREE.Vector3(1, 0, 0)
const yAxis = new THREE.Vector3(0, 1, 0)

export function updateCameraPosition(
  viewMode: ViewMode,
  effectManager: EffectManager,
  moveCamera: (params: { targetX?: number; targetY?: number; targetZ?: number; distance?: number }) => void,
  controls: OrbitControls | null,
): void {
  if (!effectManager.camera) return

  if ([ViewMode.BIO, ViewMode.MINT, ViewMode.CHAT].includes(viewMode)) {
    // auto move camera
    if (viewMode === ViewMode.CHAT) {
      cameraDistance = cameraDistanceChat
      centerCameraTarget.copy(centerCameraTargetChat)
      centerCameraPosition.copy(centerCameraPositionChat)
      centerCameraPositionLength = centerCameraPositionLengthChat
      ndcBias = ndcBiasChat
    } else {
      cameraDistance = cameraDistanceOther
      centerCameraTarget.copy(centerCameraTargetOther)
      centerCameraPosition.copy(centerCameraPositionOther)
      centerCameraPositionLength = centerCameraPositionLengthOther
      ndcBias = ndcBiasOther
    }

    localVector4.set(0, 0, centerCameraPositionLength, 1).applyMatrix4(effectManager.camera.projectionMatrix)
    localVector4.x /= localVector4.w
    localVector4.y /= localVector4.w
    localVector4.z /= localVector4.w
    const moveX = localVector4_2
      .set(ndcBias * localVector4.w, localVector4.y * localVector4.w, localVector4.z * localVector4.w, localVector4.w)
      .applyMatrix4(effectManager.camera.projectionMatrixInverse).x

    const angle = localVector3.set(centerCameraPosition.x, 0, centerCameraPosition.z).angleTo(xAxis)
    localVector3.set(moveX, 0, 0).applyAxisAngle(yAxis, angle)
    localVector3.add(centerCameraTarget)

    moveCamera({
      // left half center
      targetX: localVector3.x,
      targetY: localVector3.y,
      targetZ: localVector3.z,
      distance: cameraDistance,
    })
  } else {
    moveCamera({
      // center
      targetX: 0,
      targetY: centerCameraTargetOther.y,
      targetZ: 0,
      distance: cameraDistanceOther,
    })
  }

  if (controls) {
    if ([ViewMode.APPEARANCE, ViewMode.SAVE, ViewMode.MINT].includes(viewMode)) {
      controls.enabled = true
    } else {
      controls.enabled = false
    }
  }
}
