// src/utils/fetchFunctions.js
import { AnimationManager } from '@/library/animationManager'
import { BlinkManager } from '@/library/blinkManager'
import { LookAtManager } from '@/library/lookatManager'
import { EffectManager } from '@/library/effectManager'
import { GLTFLoader } from 'three-stdlib'

import manifest from './manifest.json'
import personality from './personality.json'
// Other constants and local variables...

// Fetch functions
const assetImportPath = process.env.VITE_ASSET_PATH + '/manifest.json'
const peresonalityImportPath = process.env.VITE_ASSET_PATH + '/personality.json'

async function fetchManifest() {
  return manifest
}
async function fetchPersonality() {
  // const personality = localStorage.getItem('personality')
  // if (personality) {
  //   return JSON.parse(personality)
  // }
  // const response = await fetch(peresonalityImportPath)
  // const data = await response.json()
  // localStorage.setItem('personality', JSON.stringify(data))
  return personality
}

async function fetchScene() {
  // load environment
  const modelPath = '/3d/Platform.glb'

  const loader = new GLTFLoader()
  // load the modelPath
  const gltf = await loader.loadAsync(modelPath)
  return gltf.scene
}

async function fetchAnimation(templateInfo) {
  // create an animation manager for all the traits that will be loaded
  const newAnimationManager = new AnimationManager(templateInfo.offset)
  await newAnimationManager.loadAnimations(templateInfo.animationPath)
  return newAnimationManager
}

async function fetchAll() {
  const initialManifest = await fetchManifest()
  const personality = await fetchPersonality()
  const sceneModel = await fetchScene()

  const blinkManager = new BlinkManager(0.1, 0.1, 0.5, 5)
  const lookatManager = new LookAtManager(80, 'editor-scene')
  const effectManager = new EffectManager()

  return {
    initialManifest,
    personality,
    sceneModel,
    blinkManager,
    lookatManager,
    effectManager,
  }
}

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

export { fetchAll, fetchAnimation }
