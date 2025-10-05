import {useFrame} from "@react-three/fiber";
import pollPlayerInput from "@/common/systems/pollPlayerInput.ts";
import {useWorld} from "koota/react";
import {useKeyboardControls} from "@react-three/drei";
import type {KeyboardControlType} from "@/common/defs/keyboardControlMap.ts";
import {useRapier} from "@react-three/rapier";
import {syncColliderAndMesh} from "@/common/systems/syncColliderAndMesh.ts";
import {updatePlayerVelocity} from "@/common/systems/updatePlayerVelocity.ts";
import {addJumpBuffer} from "@/common/systems/addJumpBuffer.ts";
import {freeJumpBuffer} from "@/common/systems/freeJumpBuffer.ts";
import {doJump} from "@/common/systems/doJump.ts";
import {Elapsed} from "@/common/traits/Elapsed.ts";
import {applyPlayerColor} from "@/common/systems/applyPlayerColor.ts";
import {updateCamPos} from "@/common/systems/physics/updateCamPos.ts";

export default function FrameLoop() {

    const world = useWorld();
    const [, getInput] = useKeyboardControls<KeyboardControlType>();
    const rapier = useRapier();

    useFrame(({gl, scene, camera}, delta) => {
        // TODO: Devtools
        // console.log(world.query().map(entity => {
        //     var traits = Array.from(world.traits).map(tr => {
        //         if (entity.has(tr)) {
        //             return {name: tr.name, data: entity.get(tr)}
        //         }
        //     })
        //     return { id: entity.id, traits: traits.filter(Boolean) }
        // }))

        var input = getInput();

        world.set(Elapsed, world.get(Elapsed)! + delta);
        pollPlayerInput(world, input);
        syncColliderAndMesh(world);
        updatePlayerVelocity(world);
        applyPlayerColor(world);

        addJumpBuffer(world);
        doJump(world);
        freeJumpBuffer(world);
    })

    return <></>
}