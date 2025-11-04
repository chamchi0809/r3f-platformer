import {useFrame} from "@react-three/fiber";
import pollPlayerInput from "@/common/systems/pollPlayerInput.ts";
import {useWorld} from "koota/react";
import {useKeyboardControls} from "@react-three/drei";
import type {KeyboardControlType} from "@/common/defs/keyboardControlMap.ts";
import {syncVisualPositionAndMesh} from "@/common/systems/syncVisualPositionAndMesh.ts";
import {updateCharacterVelocity} from "@/common/systems/updateCharacterVelocity.ts";
import {addJumpBuffer} from "@/common/systems/addJumpBuffer.ts";
import {freeJumpBuffer} from "@/common/systems/freeJumpBuffer.ts";
import {doJump} from "@/common/systems/doJump.ts";
import {Elapsed} from "@/common/traits/Elapsed.ts";
import {applyPlayerColor} from "@/common/systems/applyPlayerColor.ts";
import {syncControllerAndVisualPosition} from "@/common/systems/syncControllerAndVisualPosition.ts";

export default function FrameLoop() {

    const world = useWorld();
    const [, getInput] = useKeyboardControls<KeyboardControlType>();

    useFrame((_, delta) => {
        // TODO: Devtools
        // console.log(world.query().map(entity => {
        //     var traits = Array.from(world.traits).map(tr => {
        //         if (entity.has(tr)) {
        //             return {name: tr.name, data: entity.get(tr)}
        //         }
        //     })
        //     return { id: entity.id, traits: traits.filter(Boolean) }
        // }))
        // TODO: GPU Info
        // const ctx = gl.getContext();
        // const debugInfo = ctx.getExtension('WEBGL_debug_renderer_info');
        // if (debugInfo) {
        //     const renderer = ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        //     console.log('Active GPU:', renderer);
        // }

        const input = getInput();

        world.set(Elapsed, world.get(Elapsed)! + delta);
        pollPlayerInput(world, input);
        syncControllerAndVisualPosition(world);
        syncVisualPositionAndMesh(world);
        updateCharacterVelocity(world);
        applyPlayerColor(world);

        addJumpBuffer(world);
        doJump(world);
        freeJumpBuffer(world);
    })

    return <></>
}