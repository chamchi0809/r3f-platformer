import type { World } from "koota"
import { CharacterJumpBuffer } from "@/common/traits/CharacterValues.ts"
import { Elapsed } from "@/common/traits/Elapsed.ts"

export const freeJumpBuffer = (world: World) => {
  world.query(CharacterJumpBuffer).updateEach(([buffer], entity) => {
    if (world.get(Elapsed)! - buffer.time > buffer.duration) {
      entity.remove(CharacterJumpBuffer)
    }
  })
}
