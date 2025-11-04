import type { World } from "koota"
import { CharacterControllerRef } from "@/common/traits/CharacterControllerRef.ts"
import { CharacterVelocity } from "@/common/traits/CharacterValues.ts"
import { physicsSettings } from "@/common/defs/physicsSettings.ts"

export const applyCharacterVelocity = (world: World) => {
  world.query(CharacterControllerRef, CharacterVelocity).updateEach(([controller, vel]) => {
    controller.move(vel.x * physicsSettings.timestep, vel.y * physicsSettings.timestep)
  })
}
