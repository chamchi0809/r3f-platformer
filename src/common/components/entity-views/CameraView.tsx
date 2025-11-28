import type { Entity } from "koota";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { CAM_SIZE } from "@/common/defs/camSize.ts";
import { CameraControls, OrthographicCamera } from "@react-three/drei";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait.ts";
import { RootRef } from "@/common/traits/RootRef.ts";
import { useTrait } from "koota/react";
import { CameraSize } from "@/common/traits/CameraSize.ts";
import { useControls } from "leva";

export default function CameraView({ entity }: { entity: Entity }) {
  const { aspect } = useThree(state => state.viewport);
  const camSize = useTrait(entity, CameraSize)?.size;

  const frustum = useMemo(() => {
    const height = (camSize ?? CAM_SIZE) * 2;
    const width = height * aspect;

    return {
      top: height / 2,
      bottom: -height / 2,
      left: -width / 2,
      right: width / 2,
    };
  }, [aspect, camSize]);

  const { isDebugCamera } = useControls({
    isDebugCamera: false,
  });

  return (
    <OrthographicCamera
      ref={useRefTrait(entity, RootRef)}
      manual
      makeDefault
      rotation={isDebugCamera ? undefined : [0, 0, 0]}
      {...frustum}
    >
      {isDebugCamera && <CameraControls />}
    </OrthographicCamera>
  );
};
