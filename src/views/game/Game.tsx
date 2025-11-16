import LdtkMap from "@/common/ldtk/components/LdtkMap.tsx";
import TileRectCollider from "@/common/ldtk/components/tiles/TileRectCollider.tsx";
import TileVoxelCollider from "@/common/ldtk/components/tiles/TileVoxelCollider.tsx";
import PlayerSpawner from "@/common/components/entity-spawners/PlayerSpawner.tsx";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
import Lifecycles from "@/common/components/lifecycles/Lifecycles.tsx";
import Postprocesses from "@/common/components/postprocesses/Postprocesses.tsx";
import EntityRenderers from "@/common/components/entity-renderers/EntityRenderers.tsx";
import NPCSpawner from "@/common/components/entity-spawners/NPCSpawner.tsx";
import EnemySpawner from "@/common/components/entity-spawners/EnemySpawner.tsx";

export default function Game() {
  return (
    <>
      <ambientLight color="white" intensity={Math.PI / 3} />
      <Perf position="top-left" />
      <Lifecycles />
      <Postprocesses />
      <EntityRenderers />
      <Suspense>
        <LdtkMap
          ldtkPath="/assets/ldtk/map.ldtk"
          entityRendererMap={{
            PlayerStart: PlayerSpawner,
            NPC: NPCSpawner,
            Enemy: EnemySpawner,
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
