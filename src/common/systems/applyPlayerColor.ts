import type {World} from "koota";
import {ColliderRef} from "@/common/traits/ColliderRef.ts";
import {PlayerStates} from "@/common/traits/PlayerStates.ts";
import {MaterialRef} from "@/common/traits/MaterialRef.ts";
import {INTERACTION_GROUPS} from "@/common/defs/colGroup.ts";

export const applyPlayerColor = (world: World) => {
    world.query(PlayerStates, ColliderRef, MaterialRef).updateEach(([playerState, colliderRef, materialRef]) => {
        const color = playerState.color;
        colliderRef.col.setCollisionGroups(color === "white" ? INTERACTION_GROUPS.WHITE : INTERACTION_GROUPS.BLACK);
        (materialRef as any)?.setValues({color: color === "white" ? "white" : "black"});
    });
}