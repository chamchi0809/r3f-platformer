import type {World} from "koota";
import {physicsSettings} from "@/common/defs/physicsSettings.ts";
import {CharacterVelocity} from "@/common/traits/CharacterValues.ts";
import {CharacterControllerRef} from "@/common/traits/CharacterControllerRef.ts";

export const applyCharacterGravity = (world: World) => {
    world.query(CharacterControllerRef, CharacterVelocity).updateEach(([ctrl, vel]) => {
        vel.y += physicsSettings.gravity * physicsSettings.timestep;

        if (ctrl.isGrounded && vel.y < 0) {
            vel.y = 0;
        }
    })
}