import type {World} from "koota";
import {physicsSettings} from "@/common/defs/physicsSettings.ts";
import {CharacterVelocity} from "@/common/traits/CharacterValues.ts";
import {KinematicControllerRef} from "@/common/traits/KinematicControllerRef.ts";

export const applyCharacterGravity = (world: World) => {
    world.query(KinematicControllerRef, CharacterVelocity).updateEach(([ctrl, vel]) => {
        vel.y += physicsSettings.gravity * physicsSettings.timestep;

        if (ctrl.isGrounded && vel.y < 0) {
            vel.y = 0;
        }
    })
}