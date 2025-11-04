import { useKeyboardControls } from '@react-three/drei'
import type { KeyboardControlType } from '@/common/defs/keyboardControlMap.ts'
import { useEffect } from 'react'
import { pressedTransformInput } from '@/common/systems/pressed/pressedTransformInput.ts'
import { useWorld } from 'koota/react'

export default function KeyboardEvents() {
  const world = useWorld()
  const [subInput] = useKeyboardControls<KeyboardControlType>()

  useEffect(() => {
    return subInput(
      state => state.transform,
      (pressed) => {
        if (pressed) pressedTransformInput(world)
      },
    )
  }, [])

  return <></>
}
