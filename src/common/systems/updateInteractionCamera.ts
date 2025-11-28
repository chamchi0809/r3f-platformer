import { world } from "@/common/world.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { IsCamera } from "@/common/traits/IsCamera.ts";
import { RootRef } from "@/common/traits/RootRef.ts";
import * as THREE from "three";
import { CameraSize } from "@/common/traits/CameraSize.ts";
import { CAM_INTERACTION_SIZE } from "@/common/defs/camSize.ts";

export const updateInteractionCamera = (delta: number) => {
  const player = world.queryFirst(IsPlayer);
  const opponent = world.queryFirst(IsInteracting);

  if (player && opponent) {
    const playerPos = player.get(RootRef)!.position;
    const opponentPos = opponent.get(RootRef)!.position;

    const midPointX = (playerPos.x + opponentPos.x) / 2;
    const midPointY = (playerPos.y + opponentPos.y) / 2; // Slightly above the midpoint

    world.query(IsCamera, RootRef, CameraSize).updateEach(([, camObj, camSize]) => {
      camObj.position.lerp(new THREE.Vector3(midPointX, midPointY, 10), delta * 5);
      camSize.size = THREE.MathUtils.lerp(camSize.size, CAM_INTERACTION_SIZE, delta * 5);
    });
  }
};
