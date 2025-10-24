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
import {Bloom, EffectComposer, Noise, Sepia, Vignette} from "@react-three/postprocessing";
import {BlendFunction, VignetteTechnique} from "postprocessing";


export default function Game() {

    return <>
        <EffectComposer multisampling={0} enabled={true}>
            <Sepia
                intensity={0.2}
                blendFunction={BlendFunction.NORMAL}
            />
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300}/>
            <Noise opacity={0.07}/>
            <Vignette technique={VignetteTechnique.DEFAULT} offset={0.1} darkness={1.1}/>
        </EffectComposer>
        <Perf position={"top-left"}/>
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