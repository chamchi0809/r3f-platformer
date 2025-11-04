import type { World } from "koota"
import { PlayerStates } from "@/common/traits/PlayerStates.ts"
import { MaterialRef } from "@/common/traits/MaterialRef.ts"
import { INTERACTION_GROUPS } from "@/common/defs/colGroup.ts"
import { CharacterControllerRef } from "@/common/traits/CharacterControllerRef.ts"

export const applyPlayerColor = (world: World) => {
  world.query(PlayerStates, CharacterControllerRef, MaterialRef).updateEach(([playerState, ctrl, materialRef]) => {
    const color = playerState.color
    ctrl.col.setCollisionGroups(color === "white" ? INTERACTION_GROUPS.WHITE : INTERACTION_GROUPS.BLACK)
    // @ts-expect-error: 2353
    materialRef.setValues({ color: color === "white" ? "white" : "black" })
  })
}
