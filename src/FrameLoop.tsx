import {useFrame} from "@react-three/fiber";
import pollPlayerMoveInput from "@/common/systems/pollPlayerMoveInput.ts";
import {useWorld} from "koota/react";
import {useKeyboardControls} from "@react-three/drei";
import type {KeyboardControlType} from "@/common/defs/keyboardControlMap.ts";
import {useRapier} from "@react-three/rapier";

export default function FrameLoop() {

    const world = useWorld();
    const [, getInput] = useKeyboardControls<KeyboardControlType>();
    const rapier = useRapier();

    useFrame((state, delta) => {
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

        pollPlayerMoveInput(world, input);
    })

    return <></>
}