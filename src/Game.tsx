import LdtkMap from "@/common/ldtk/components/LdtkMap.tsx";
import TileRectCollider from "@/common/ldtk/components/tiles/TileRectCollider.tsx";
import CameraRenderer from "@/common/components/CameraRenderer.tsx";
import TileConvexCollider from "@/common/ldtk/components/tiles/TileConvexCollider.tsx";
import {INTERACTION_GROUPS} from "@/common/defs/colGroup.ts";
import TileVoxelCollider from "@/common/ldtk/components/tiles/TileVoxelCollider.tsx";
import Startup from "@/common/lifecycles/Startup.tsx";
import FrameLoop from "@/common/lifecycles/FrameLoop.tsx";
import PlayerSpawner from "@/common/components/PlayerSpawner.tsx";
import PlayerRenderer from "@/common/components/PlayerRenderer.tsx";
import PhysicsLoop from "@/common/lifecycles/PhysicsLoop.tsx";
import KeyboardEvents from "@/common/lifecycles/KeyboardEvents.tsx";
import {Perf} from "r3f-perf";
import {Suspense} from "react";
import {ChromaticAberration, EffectComposer} from "@react-three/postprocessing";
import FrameLimiter from "@/common/components/FrameLimiter.tsx";

export default function Game() {

    return <>
        {/*<FrameLimiter/>*/}
        <EffectComposer multisampling={0} enabled={true} >

        </EffectComposer>
        <Perf/>
        <Startup/>
        <FrameLoop/>
        <KeyboardEvents/>
        <PhysicsLoop/>
        <mesh position-z={-0.1} receiveShadow>
            <planeGeometry args={[100, 100]}/>
            <meshStandardMaterial color={"#ddd"} side={2}/>
        </mesh>
        <ambientLight color={"white"} intensity={Math.PI / 3}/>
        <CameraRenderer/>
        <PlayerRenderer/>
        <Suspense>
            <LdtkMap
                ldtkPath={"/assets/ldtk/test.ldtk"}
                entityRendererMap={{
                    "PlayerStart": PlayerSpawner
                }}
                tileRendererMap={{
                    "RECT": (props) => {
                        return <>
                            <TileRectCollider {...props}/>
                        </>
                    },
                    "RECT_GREY": (props) => {
                        return <>
                            <TileRectCollider {...props} interactionGroups={INTERACTION_GROUPS.DEFAULT}/>
                        </>
                    },
                    "RECT_WHITE": (props) => {
                        return <>
                            <TileRectCollider {...props} interactionGroups={INTERACTION_GROUPS.WHITE}/>
                        </>
                    },
                    "RECT_BLACK": (props) => {
                        return <>
                            <TileRectCollider {...props} interactionGroups={INTERACTION_GROUPS.BLACK}/>
                        </>
                    },
                    "SPIKE_GREY": (props) => {
                        return <>
                            <TileVoxelCollider {...props} interactionGroups={INTERACTION_GROUPS.DEFAULT}/>
                        </>
                    },
                    "SPIKE_WHITE": (props) => {
                        return <>
                            <TileConvexCollider {...props} interactionGroups={INTERACTION_GROUPS.WHITE}/>
                        </>
                    },
                    "SPIKE_BLACK": (props) => {
                        return <>
                            <TileVoxelCollider {...props} interactionGroups={INTERACTION_GROUPS.BLACK}/>
                        </>
                    },
                }}
            />
        </Suspense>
    </>
}