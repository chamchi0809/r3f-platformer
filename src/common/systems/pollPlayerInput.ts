import type { World } from 'koota'
import { IsPlayer } from '@/common/traits/IsPlayer.ts'
import { MoveInput } from '@/common/traits/MoveInput.ts'
import type { KeyboardControlType } from '@/common/defs/keyboardControlMap.ts'
import { JumpInput } from '@/common/traits/JumpInput.ts'

export default function pollPlayerInput(world: World, keys: Record<KeyboardControlType, boolean>) {
  world.query(IsPlayer, MoveInput, JumpInput)
    .updateEach(([, moveInput, jumpInput]) => {
      const horizontal = (keys.right ? 1 : 0) - (keys.left ? 1 : 0)
      const vertical = (keys.up ? 1 : 0) - (keys.down ? 1 : 0)

      moveInput.set(horizontal, vertical)
      jumpInput.on = keys.jump
    })
}
