import {useQueryFirst} from "koota/react";
import {IsPlayer} from "@/common/traits/IsPlayer.ts";
import type {Entity} from "koota";
import {StartPosition} from "@/common/traits/StartPosition.ts";
import {useThreeInjector} from "@/common/hooks/useThreeInjector.ts";
import {CuboidCollider} from "@react-three/rapier";
import {useColliderInjector} from "@/common/hooks/useColliderInjector.ts";
import {useKinematicControllerInjector} from "@/common/hooks/useKinematicControllerInjector.ts";

const PlayerView = ({entity}: { entity: Entity }) => {

    const startPos = entity.get(StartPosition)!;
    const threeRef = useThreeInjector(entity);
    const colliderRef = useColliderInjector(entity);
    const movementRef = useKinematicControllerInjector(entity);

    return <>
        <CuboidCollider
            ref={comp => {
                colliderRef(comp);
                movementRef(comp);
            }}
            args={[0.4, 0.4, 0.4]} position={[startPos.x, startPos.y, 0]} mass={1} restitution={0} friction={1}/>
        <mesh ref={threeRef}>
            <boxGeometry args={[0.8, 0.8, 0.8]}/>
            <meshStandardMaterial color={"orange"}/>
        </mesh>
    </>
}

export default function PlayerRenderer() {

    const player = useQueryFirst(IsPlayer);

    if (!player) {
        return <></>;
    }

    return <PlayerView entity={player}/>
}