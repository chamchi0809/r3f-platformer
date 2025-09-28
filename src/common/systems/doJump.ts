import type {World} from "koota";
import {CharacterStats} from "@/common/traits/CharacterStats.ts";
import {CharacterJumpBuffer, CharacterVelocity} from "@/common/traits/CharacterValues.ts";
import {KinematicControllerRef} from "@/common/traits/KinematicControllerRef.ts";

export const doJump = (world: World) => {
    world.query(CharacterStats.jumpStrength, CharacterVelocity, KinematicControllerRef, CharacterJumpBuffer).updateEach(([jumpStrength, vel, ctrl, buffer], entity) => {
        if (ctrl.isGrounded) {
            vel.y = jumpStrength;
            entity.remove(CharacterJumpBuffer);
        }
    });
}