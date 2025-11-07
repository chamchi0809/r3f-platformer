import { useWorld } from "koota/react";
import { useCallback } from "react";
import type { Entity } from "koota";
import type { MeshLambertMaterial } from "three";
import { MaterialRef } from "@/common/traits/MaterialRef.ts";

export const useMaterialInjector = (entity: Entity) => {
  const world = useWorld();
  const injectRef = useCallback(
    <T extends MeshLambertMaterial>(component: T | null) => {
      if (!component) {
        return;
      }
      if (!world.has(entity)) return;
      entity.add(MaterialRef(component));
      return () => entity.remove(MaterialRef);
    },
    [entity],
  );

  return injectRef;
};
