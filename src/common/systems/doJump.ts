import type {World} from "koota";
import {CharacterStats} from "@/common/traits/CharacterStats.ts";
import {CharacterJumpBuffer, CharacterVelocity} from "@/common/traits/CharacterValues.ts";
import {CharacterControllerRef} from "@/common/traits/CharacterControllerRef.ts";

export const doJump = (world: World) => {
    world.query(CharacterStats.jumpStrength, CharacterVelocity, CharacterControllerRef, CharacterJumpBuffer).updateEach(([jumpStrength, vel, ctrl], entity) => {
        if (ctrl.isGrounded) {
            vel.y = jumpStrength;
            entity.remove(CharacterJumpBuffer);
        }
    });
}