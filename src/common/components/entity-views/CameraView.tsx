import type { Entity } from "koota";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { CAM_SIZE } from "@/common/defs/camSize.ts";
import { OrthographicCamera } from "@react-three/drei";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait.ts";
import { ThreeRef } from "@/common/traits/ThreeRef.ts";
import { useTrait } from "koota/react";
import { CameraSize } from "@/common/traits/CameraSize.ts";

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

  return (
    <OrthographicCamera
      ref={useRefTrait(entity, ThreeRef)}
      manual
      makeDefault
      {...frustum}
    />
  );
};
