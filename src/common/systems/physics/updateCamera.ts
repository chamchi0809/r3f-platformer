import type { World } from "koota";
import { IsCamera } from "@/common/traits/IsCamera.ts";
import { RootRef } from "@/common/traits/RootRef.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import { CharacterControllerRef } from "@/common/traits/CharacterControllerRef.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { CameraSize } from "@/common/traits/CameraSize.ts";
import { CAM_SIZE } from "@/common/defs/camSize.ts";
import * as THREE from "three";

export const updateCamera = (world: World, delta: number) => {
  world.query(IsCamera, RootRef, CameraSize).updateEach(([, camera, camSize]) => {
    world.query(IsPlayer, CharacterControllerRef).updateEach(([, ctrl]) => {
      if (world.queryFirst(IsInteracting)) return;
      const cam = camera as THREE.Camera;
      const translation = ctrl.col.translation();

      // Snap camera position to pixel grid on both axes
      cam.position.lerp(new THREE.Vector3(translation.x, translation.y, 10), delta * 5);

      camSize.size = THREE.MathUtils.lerp(camSize.size, CAM_SIZE, delta * 5);
    });
  });
};
