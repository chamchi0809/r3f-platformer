import { OrthographicCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import type { Entity } from "koota";
import { useQueryFirst } from "koota/react";
import { IsCamera } from "@/common/traits/IsCamera.ts";
import { useThreeInjector } from "@/common/hooks/injection/useThreeInjector.ts";
import { CAM_SIZE } from "@/common/defs/camSize.ts";
import { useUnmount } from "react-use";

const CameraView = (
  {
    entity,
  }: {
    entity: Entity
  }) => {
  const { aspect } = useThree(state => state.viewport);
  const frustum = useMemo(() => {
    const height = CAM_SIZE * 2;
    const width = height * aspect;

    return {
      top: height / 2,
      bottom: -height / 2,
      left: -width / 2,
      right: width / 2,
    };
  }, [aspect]);

  const injectRef = useThreeInjector(entity);

  return (
    <OrthographicCamera
      ref={injectRef}
      manual
      makeDefault
      {...frustum}
    >
      {/* <CameraControls/> */}
    </OrthographicCamera>
  );
};

export default function CameraRenderer() {
  const camera = useQueryFirst(IsCamera);

  useUnmount(() => {
    camera?.destroy();
  });

  return camera && <CameraView entity={camera} />;
}
