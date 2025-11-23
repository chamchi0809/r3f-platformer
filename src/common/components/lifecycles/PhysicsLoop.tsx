import { useWorld } from "koota/react";
import { applyCharacterGravity } from "@/common/systems/physics/applyCharacterGravity.ts";
import { applyCharacterVelocity } from "@/common/systems/physics/applyCharacterVelocity.ts";
import { physicsSettings } from "@/common/defs/physicsSettings.ts";
import { updateCamera } from "@/common/systems/physics/updateCamera.ts";
import useBeforePhysicsStep from "@/common/hooks/physics/useBeforePhysicsStep.tsx";
import { updateInteractionFocus } from "@/common/systems/physics/updateInteractionFocus";
import { updateInteractionPos } from "@/common/systems/physics/updateInteractionPos";

export default function PhysicsLoop() {
  const world = useWorld();

  useBeforePhysicsStep(() => {
    applyCharacterGravity(world);
    applyCharacterVelocity(world);
    updateInteractionFocus(world);
    updateInteractionPos(world);
    updateCamera(world, physicsSettings.timestep);
  });
  return <></>;
}
