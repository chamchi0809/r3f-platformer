import PlayerRenderer from "@/common/components/entity-renderers/PlayerRenderer.tsx";
import CameraRenderer from "@/common/components/entity-renderers/CameraRenderer.tsx";

/** Koota entity renderers */
export default function EntityRenderers() {
  return (
    <>
      <CameraRenderer />
      <PlayerRenderer />
    </>
  );
}
