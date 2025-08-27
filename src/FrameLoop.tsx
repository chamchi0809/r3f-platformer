import {useFrame} from "@react-three/fiber";
import pollMoveInput from "@/common/systems/pollMoveInput.ts";
import {useWorld} from "koota/react";

export default function FrameLoop() {

    const world = useWorld();

    useFrame((state, delta) => {
        pollMoveInput(world);
    })

    return <></>
}