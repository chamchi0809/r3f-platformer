import LdtkMap from "@/common/ldtk/components/LdtkMap.tsx";
import TileRectCollider from "@/common/ldtk/components/tiles/TileRectCollider.tsx";
import CameraRenderer from "@/common/components/CameraRenderer.tsx";
import TileVoxelCollider from "@/common/ldtk/components/tiles/TileVoxelCollider.tsx";
import Startup from "@/common/lifecycles/Startup.tsx";
import FrameLoop from "@/common/lifecycles/FrameLoop.tsx";
import PlayerSpawner from "@/common/components/PlayerSpawner.tsx";
import PlayerRenderer from "@/common/components/PlayerRenderer.tsx";
import PhysicsLoop from "@/common/lifecycles/PhysicsLoop.tsx";
import KeyboardEvents from "@/common/lifecycles/KeyboardEvents.tsx";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
import { Bloom, EffectComposer, Noise, Sepia, Vignette } from "@react-three/postprocessing";
import { BlendFunction, VignetteTechnique } from "postprocessing";
import { KeyboardControls } from "@react-three/drei";
import { rhythmControlMap } from "@/common/defs/keyboardControlMap.ts";
import RhythmKeyboardEvents from "@/common/lifecycles/RhythmKeyboardEvents.tsx";

export default function Game() {
  return (
    <>
      <EffectComposer multisampling={0} enabled={true}>
        <Sepia
          intensity={0.2}
          blendFunction={BlendFunction.NORMAL}
        />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.07} />
        <Vignette technique={VignetteTechnique.DEFAULT} offset={0.1} darkness={1.1} />
      </EffectComposer>
      <Perf position="top-left" />
      <Startup />
      <FrameLoop />
      <KeyboardEvents />
      <KeyboardControls map={rhythmControlMap}>
        <RhythmKeyboardEvents />
      </KeyboardControls>
      <PhysicsLoop />
      <ambientLight color="white" intensity={Math.PI / 3} />
      <CameraRenderer />
      <PlayerRenderer />
      <Suspense>
        <LdtkMap
          ldtkPath="/assets/ldtk/map.ldtk"
          entityRendererMap={{
            PlayerStart: PlayerSpawner,
          }}
          tileRendererMap={{
            RECT: (props) => {
              return <TileRectCollider {...props} />;
            },
            VOXEL: (props) => {
              return <TileVoxelCollider {...props} />;
            },
          }}
        />
      </Suspense>
    </>
  );
}
