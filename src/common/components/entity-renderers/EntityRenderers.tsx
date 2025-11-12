import PlayerRenderer from "@/common/components/entity-renderers/PlayerRenderer.tsx";
import CameraRenderer from "@/common/components/entity-renderers/CameraRenderer.tsx";
import EnemiesRenderer from "@/common/components/entity-renderers/EnemiesRenderer.tsx";
import NPCsRenderer from "@/common/components/entity-renderers/NPCsRenderer.tsx";

/** Koota entity renderers */
export default function EntityRenderers() {
  return (
    <>
      <CameraRenderer />
      <PlayerRenderer />
      <EnemiesRenderer />
      <NPCsRenderer />
    </>
  );
}
