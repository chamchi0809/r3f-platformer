import type {World} from "koota";
import {IsCamera} from "@/common/traits/IsCamera.ts";
import {ThreeRef} from "@/common/traits/ThreeRef.ts";
import {IsPlayer} from "@/common/traits/IsPlayer.ts";
import {KinematicControllerRef} from "@/common/traits/KinematicControllerRef.ts";
import * as THREE from "three";

const vec3 = new THREE.Vector3();

export const updateCamPos = (world: World, delta: number) => {
    world.query(IsCamera, ThreeRef).updateEach(([, camera]) => {
        world.query(IsPlayer, KinematicControllerRef).updateEach(([, ctrl]) => {
            // (camera as THREE.Camera).position.add(new Vector3(0,0,10))
            (camera as THREE.Camera).position.lerp(vec3.set(ctrl.col.translation().x, ctrl.col.translation().y, 10), delta * 2);
        })
    })
};