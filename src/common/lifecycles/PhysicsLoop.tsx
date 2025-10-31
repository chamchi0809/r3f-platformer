import {useWorld} from "koota/react";
import {applyCharacterGravity} from "@/common/systems/physics/applyCharacterGravity.ts";
import {applyCharacterVelocity} from "@/common/systems/physics/applyCharacterVelocity.ts";
import {physicsSettings} from "@/common/defs/physicsSettings.ts";
import {updateCamPos} from "@/common/systems/physics/updateCamPos.ts";
import useRapier from "@/common/hooks/physics/useRapier.ts";
import useBeforePhysicsStep from "@/common/hooks/physics/useAfterPhysicsStep.tsx";

export default function PhysicsLoop() {

    const world = useWorld();
    const rapier = useRapier();
    const {} = rapier;

    useBeforePhysicsStep((rapierWorld) => {
        applyCharacterGravity(world);
        applyCharacterVelocity(world);
        updateCamPos(world, physicsSettings.timestep);
    });
    return <></>
}