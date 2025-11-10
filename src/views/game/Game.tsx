import LdtkMap from "@/common/ldtk/components/LdtkMap.tsx";
import TileRectCollider from "@/common/ldtk/components/tiles/TileRectCollider.tsx";
import CameraRenderer from "@/common/components/CameraRenderer.tsx";
import TileVoxelCollider from "@/common/ldtk/components/tiles/TileVoxelCollider.tsx";
import PlayerSpawner from "@/common/components/PlayerSpawner.tsx";
import PlayerRenderer from "@/common/components/PlayerRenderer.tsx";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
import Lifecycles from "@/common/lifecycles/Lifecycles.tsx";
import Postprocesses from "@/common/postprocesses/Postprocesses.tsx";

export default function Game() {
  return (
    <>
      <ambientLight color="white" intensity={Math.PI / 3} />
      <Perf position="top-left" />
      <Lifecycles />
      <Postprocesses />
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
