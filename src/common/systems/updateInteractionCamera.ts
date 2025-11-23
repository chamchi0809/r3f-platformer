import { world } from "@/common/world.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { IsCamera } from "@/common/traits/IsCamera.ts";
import { ThreeRef } from "@/common/traits/ThreeRef.ts";
import * as THREE from "three";
import { CameraSize } from "@/common/traits/CameraSize.ts";
import { CAM_INTERACTION_SIZE } from "@/common/defs/camSize.ts";

export const updateInteractionCamera = (delta: number) => {
  const player = world.queryFirst(IsPlayer);
  const opponent = world.queryFirst(IsInteracting);
  const camera = world.queryFirst(IsCamera);

  if (player && opponent && camera) {
    const playerPos = player.get(ThreeRef)!.position;
    const opponentPos = opponent.get(ThreeRef)!.position;

    const midPointX = (playerPos.x + opponentPos.x) / 2;
    const midPointY = (playerPos.y + opponentPos.y) / 2; // Slightly above the midpoint

    const camObj = camera.get(ThreeRef)!;

    camObj.position.lerp(new THREE.Vector3(midPointX, midPointY, 10), delta * 5);
    if (camera.get(CameraSize)?.size === CAM_INTERACTION_SIZE) return;
    camera.set(CameraSize, { size: CAM_INTERACTION_SIZE });
  }
};
