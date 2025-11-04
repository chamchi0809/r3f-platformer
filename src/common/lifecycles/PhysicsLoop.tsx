import {useWorld} from "koota/react";
import {applyCharacterGravity} from "@/common/systems/physics/applyCharacterGravity.ts";
import {applyCharacterVelocity} from "@/common/systems/physics/applyCharacterVelocity.ts";
import {physicsSettings} from "@/common/defs/physicsSettings.ts";
import {updateCamPos} from "@/common/systems/physics/updateCamPos.ts";
import useBeforePhysicsStep from "@/common/hooks/physics/useAfterPhysicsStep.tsx";

export default function PhysicsLoop() {

    const world = useWorld();

    useBeforePhysicsStep(() => {
        applyCharacterGravity(world);
        applyCharacterVelocity(world);
        updateCamPos(world, physicsSettings.timestep);
    });
    return <></>
}