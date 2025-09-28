import {useQueryFirst, useTraitEffect} from "koota/react";
import {IsPlayer} from "@/common/traits/IsPlayer.ts";
import type {Entity} from "koota";
import {StartPosition} from "@/common/traits/StartPosition.ts";
import {useThreeInjector} from "@/common/hooks/useThreeInjector.ts";
import {CuboidCollider} from "@react-three/rapier";
import {useColliderInjector} from "@/common/hooks/useColliderInjector.ts";
import {useKinematicControllerInjector} from "@/common/hooks/useKinematicControllerInjector.ts";
import {INTERACTION_GROUPS} from "@/common/defs/colGroup.ts";
import {PlayerStates} from "@/common/traits/PlayerStates.ts";
import {ColliderRef} from "@/common/traits/ColliderRef.ts";
import {useMaterialInjector} from "@/common/hooks/useMaterialInjector.ts";
import {MaterialRef} from "@/common/traits/MaterialRef.ts";
import {MeshStandardMaterial} from "three";

const PlayerView = ({entity}: { entity: Entity }) => {

    const startPos = entity.get(StartPosition)!;
    const threeRef = useThreeInjector(entity);
    const colliderRef = useColliderInjector(entity);
    const movementRef = useKinematicControllerInjector(entity);
    const materialRef = useMaterialInjector(entity);

    useTraitEffect(entity, PlayerStates, (state) => {
        const color = state?.color;
        entity.get(ColliderRef)?.col.setCollisionGroups(color === "white" ? INTERACTION_GROUPS.WHITE : INTERACTION_GROUPS.BLACK);
        (entity.get(MaterialRef) as MeshStandardMaterial)?.setValues({color: color === "white" ? "white" : "black"});
    });

    return <>
        <CuboidCollider
            ref={comp => {
                colliderRef(comp);
                movementRef(comp);
            }}
            collisionGroups={INTERACTION_GROUPS.WHITE}
            args={[0.4, 0.4, 0.4]} position={[startPos.x, startPos.y, 0]} mass={1} restitution={0} friction={1}/>
        <mesh ref={threeRef}>
            <boxGeometry args={[0.8, 0.8, 0.8]}/>
            <meshStandardMaterial color={"white"} ref={materialRef}/>
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