import {useQueryFirst} from "koota/react";
import {IsPlayer} from "@/common/traits/IsPlayer.ts";
import type {Entity} from "koota";
import {StartPosition} from "@/common/traits/StartPosition.ts";
import {useThreeInjector} from "@/common/hooks/useThreeInjector.ts";
import {CuboidCollider} from "@react-three/rapier";
import {useColliderInjector} from "@/common/hooks/useColliderInjector.ts";
import {useKinematicControllerInjector} from "@/common/hooks/useKinematicControllerInjector.ts";
import {INTERACTION_GROUPS} from "@/common/defs/colGroup.ts";
import {useMaterialInjector} from "@/common/hooks/useMaterialInjector.ts";
import {PPU} from "@/common/defs/ppu.ts";
import {CAM_SIZE} from "@/common/defs/camSize.ts";

const PlayerView = ({entity}: { entity: Entity }) => {

    const startPos = entity.get(StartPosition)!;
    const threeRef = useThreeInjector(entity);
    const colliderRef = useColliderInjector(entity);
    const movementRef = useKinematicControllerInjector(entity);
    const materialRef = useMaterialInjector(entity);

    return <>
        <CuboidCollider
            ref={comp => {
                colliderRef(comp);
                movementRef(comp);
            }}
            collisionGroups={INTERACTION_GROUPS.WHITE}
            args={[0.4, 0.4, 0.1]} position={[startPos.x, startPos.y, 0]} mass={1} restitution={0} friction={1}/>
        <group ref={threeRef}>
            <mesh>
                <boxGeometry args={[0.8, 0.8, 0.1]}/>
                <meshLambertMaterial color={"white"} ref={materialRef}/>
            </mesh>
            <pointLight castShadow position-z={2} intensity={2} decay={.5} distance={15} shadow-mapSize-width={256} shadow-mapSize-height={256} shadow-bias={0.005} shadow-normalBias={0.02}/>
        </group>
    </>
}

export default function PlayerRenderer() {

    const player = useQueryFirst(IsPlayer);

    if (!player) {
        return <></>;
    }

    return <PlayerView entity={player}/>
}