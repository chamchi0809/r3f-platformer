import { useWorld } from "koota/react";
import { useCallback } from "react";
import { ThreeRef } from "@/common/traits/ThreeRef.ts";
import type { Entity } from "koota";
import * as THREE from "three";

export const useThreeInjector = (entity: Entity) => {
  const world = useWorld();
  const injectRef = useCallback(
    <T extends THREE.Object3D>(component: T | null) => {
      if (!component) {
        return;
      }
      if (!world.has(entity)) return;
      entity.add(ThreeRef(component));
      return () => entity.remove(ThreeRef);
    },
    [entity],
  );

  return injectRef;
};
