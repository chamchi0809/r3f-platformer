import type {World} from "koota";
import {KinematicControllerRef} from "@/common/traits/KinematicControllerRef.ts";
import {CharacterVelocity} from "@/common/traits/CharacterValues.ts";
import {physicsSettings} from "@/common/defs/physicsSettings.ts";

export const applyCharacterVelocity = (world: World) => {
    world.query(KinematicControllerRef, CharacterVelocity).updateEach(([controller, vel]) => {
        controller.move(vel.x * physicsSettings.timestep, vel.y * physicsSettings.timestep);
    })
}