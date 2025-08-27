import {useQueryFirst} from "koota/react";
import {IsPlayer} from "@/common/traits/IsPlayer.ts";
import type {Entity} from "koota";
import {StartPosition} from "@/common/traits/StartPosition.ts";
import {useThreeRefInjector} from "@/common/hooks/useThreeRefInjector.ts";

const PlayerView = ({entity}: { entity: Entity }) => {

    const startPos = entity.get(StartPosition)!;
    const threeRef = useThreeRefInjector(entity);

    return <mesh ref={threeRef} position={[startPos.x, startPos.y, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]}/>
        <meshStandardMaterial color={"orange"}/>
    </mesh>
}

export default function PlayerRenderer() {

    const player = useQueryFirst(IsPlayer);

    if (!player) {
        return <></>;
    }

    return <PlayerView entity={player}/>
}