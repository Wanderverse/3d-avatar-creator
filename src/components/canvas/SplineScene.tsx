import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import Spline from '@splinetool/react-spline'

const SplineScene = ({ scene }) => {
  const ref = useRef()
  const { scene: threeScene } = useThree()

  useEffect(() => {
    if (ref.current) {
      threeScene.add(ref.current)
      return () => {
        threeScene.remove(ref.current)
      }
    }
  }, [ref, threeScene])

  return (
    <group ref={ref}>
      <Spline scene={scene} />
    </group>
  )
}

export default SplineScene
