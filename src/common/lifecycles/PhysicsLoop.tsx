import {useAfterPhysicsStep, useRapier} from "@react-three/rapier";
import {useWorld} from "koota/react";
import {applyCharacterGravity} from "@/common/systems/physics/applyCharacterGravity.ts";
import {applyCharacterVelocity} from "@/common/systems/physics/applyCharacterVelocity.ts";
import {physicsSettings} from "@/common/defs/physicsSettings.ts";
import {updateCamPos} from "@/common/systems/physics/updateCamPos.ts";

export default function PhysicsLoop() {

    const world = useWorld();
    const rapier = useRapier();
    const {} = rapier;

    useAfterPhysicsStep((rapierWorld) => {
        applyCharacterGravity(world);
        applyCharacterVelocity(world);
    });
    return <></>
}