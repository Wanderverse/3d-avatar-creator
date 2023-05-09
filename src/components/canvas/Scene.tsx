'use client'
import React, { useContext, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { extend } from '@react-three/fiber'
import { SceneContext } from '@/context/SceneContext'

extend({ OrbitControls })

function Controls({ lookatManager }) {
  const { camera, gl } = useThree()
  const controlsRef = useRef()

  useFrame(() => {
    controlsRef.current?.update()
    lookatManager.update()
  })

  useEffect(() => {
    lookatManager.setCamera(camera)
  }, [camera, lookatManager])

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.1}
      minDistance={1}
      maxDistance={4}
      maxPolarAngle={Math.PI / 2}
    />
  )
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 1, 1]} intensity={0.5} />
    </>
  )
}

export default function Scene({ sceneModel, lookatManager }) {
  const { setCamera } = useContext(SceneContext)

  return (
    <Canvas
      id='editor-scene'
      onCreated={({ gl, camera }) => {
        setCamera(camera)
        gl.outputEncoding = THREE.sRGBEncoding
      }}
      style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        // width: '100vw',
        // height: '100vh',
        pointerEvents: 'none',
      }}
    >
      <Lighting />
      <Controls lookatManager={lookatManager} />
      <primitive object={sceneModel} />
    </Canvas>
  )
}

// // import { Canvas } from '@react-three/fiber'
// // import { Preload } from '@react-three/drei'
// // import { r3f } from '@/helpers/global'

// // export default function Scene({ ...props }) {
// //   // Everything defined in here will persist between route changes, only children are swapped
// //   return (
// //     <Canvas {...props}>
// //       {/* @ts-ignore */}
// //       <r3f.Out />
// //       <Preload all />
// //     </Canvas>
// //   )
// // }
// import { Canvas } from '@react-three/fiber'
// import { Preload } from '@react-three/drei'
// import { r3f } from '@/helpers/global'

// import React, { useContext, useEffect, useState } from 'react'
// import * as THREE from 'three'
// import { SceneContext } from '@/context/SceneContext'
// import { CameraMode } from '@/context/ViewContext'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// export default function Scene({ ...props }) {
//   const { sceneModel, lookatManager } = props
//   const { scene, model, setModel, currentCameraMode, setControls, setMousePosition, setCamera } =
//     useContext(SceneContext)

//   const handleMouseMove = (event) => {
//     setMousePosition({ x: event.x, y: event.y })
//   }

//   useEffect(() => {
//     window.addEventListener('mousemove', handleMouseMove)
//     return () => window.removeEventListener('mousemove', handleMouseMove)
//   }, [handleMouseMove])

//   let loaded = false
//   let [isLoaded, setIsLoaded] = useState(false)

//   useEffect(() => {
//     // hacky prevention of double render
//     if (loaded || isLoaded) return
//     setIsLoaded(true)
//     loaded = true

//     scene.add(sceneModel)

//     // add a camera to the scene
//     const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)

//     setCamera(camera)
//     lookatManager.setCamera(camera)
//     // set the camera position
//     camera.position.set(0, 1.3, 2)

//     // TODO make sure to kill the interval

//     // find editor-scene canvas
//     const canvasRef = document.getElementById('editor-scene')

//     // create a new renderer
//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef,
//       antialias: true,
//       alpha: true,
//       preserveDrawingBuffer: true,
//     })

//     const handleResize = () => {
//       renderer.setSize(window.innerWidth, window.innerHeight)
//       camera.aspect = window.innerWidth / window.innerHeight
//       camera.updateProjectionMatrix()
//     }

//     // add an eventlistener to resize the canvas when window changes
//     window.addEventListener('resize', handleResize)

//     // set the renderer size
//     renderer.setSize(window.innerWidth, window.innerHeight)

//     // set the renderer pixel ratio
//     renderer.setPixelRatio(window.devicePixelRatio)

//     // set the renderer output encoding
//     renderer.outputEncoding = THREE.sRGBEncoding

//     const controls = new OrbitControls(camera, renderer.domElement)
//     controls.minDistance = 1
//     controls.maxDistance = 4
//     controls.maxPolarAngle = Math.PI / 2
//     controls.enablePan = true
//     controls.target = new THREE.Vector3(0, 1, 0)
//     controls.enableDamping = true
//     controls.dampingFactor = 0.1

//     setControls(controls)

//     const minPan = new THREE.Vector3(-0.5, 0, -0.5)
//     const maxPan = new THREE.Vector3(0.5, 1.5, 0.5)

//     // start animation frame loop to render
//     const animate = () => {
//       requestAnimationFrame(animate)
//       if (currentCameraMode !== CameraMode.AR) {
//         controls.target.clamp(minPan, maxPan)
//         controls?.update()
//         lookatManager.update()
//         renderer.render(scene, camera)
//       }
//     }

//     // start the animation loop
//     animate()

//     // // create animation manager
//     async function fetchAssets() {
//       if (model != null && scene != null) {
//         scene.remove(model)
//       }
//       // model holds only the elements that will be exported
//       const avatarModel = new THREE.Object3D()
//       setModel(avatarModel)

//       scene.add(avatarModel)
//     }
//     fetchAssets()
//     return () => {
//       removeEventListener('mousemove', handleMouseMove)
//       removeEventListener('resize', handleMouseMove)
//       // scene.remove(sceneModel)
//       scene.remove(model)
//     }
//   }, [])

//   return (
//     <Canvas id='editor-scene' {...props}>
//       {/* @ts-ignore */}
//       <r3f.Out />
//       <Preload all />
//     </Canvas>
//   )
// }
