import type {World} from "koota";
import {IsCamera} from "@/common/traits/IsCamera.ts";
import {ThreeRef} from "@/common/traits/ThreeRef.ts";
import {IsPlayer} from "@/common/traits/IsPlayer.ts";
import {KinematicControllerRef} from "@/common/traits/KinematicControllerRef.ts";
import * as THREE from "three";
import {PPU} from "@/common/defs/ppu.ts";


export const updateCamPos = (world: World, delta: number) => {
    world.query(IsCamera, ThreeRef).updateEach(([, camera]) => {
        world.query(IsPlayer, KinematicControllerRef).updateEach(([, ctrl]) => {
            const cam = camera as THREE.Camera;
            const translation = ctrl.col.translation();
            const pixelPerfectTranslation = new THREE.Vector3(
                Math.round(translation.x * PPU) / PPU,
                Math.round((translation.y - 0.01) * PPU) / PPU,
                translation.z
            );

            // Snap camera position to pixel grid on both axes
            cam.position.lerp(new THREE.Vector3(translation.x, translation.y, 10), delta * 5);
        })
    })
};