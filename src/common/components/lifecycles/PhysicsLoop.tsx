import { useWorld } from "koota/react";
import { applyCharacterGravity } from "@/common/systems/physics/applyCharacterGravity.ts";
import { applyCharacterVelocity } from "@/common/systems/physics/applyCharacterVelocity.ts";
import { physicsSettings } from "@/common/defs/physicsSettings.ts";
import { updateCamPos } from "@/common/systems/physics/updateCamPos.ts";
import useBeforePhysicsStep from "@/common/hooks/physics/useBeforePhysicsStep.tsx";
import { updateInteractionFocus } from "@/common/systems/physics/updateInteractionFocus";

export default function PhysicsLoop() {
  const world = useWorld();

  useBeforePhysicsStep(() => {
    applyCharacterGravity(world);
    applyCharacterVelocity(world);
    updateInteractionFocus(world);
    updateCamPos(world, physicsSettings.timestep);
  });
  return <></>;
}
