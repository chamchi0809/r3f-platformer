import type { Entity, Trait } from "koota";
import { useWorld } from "koota/react";
import { useCallback } from "react";

export const useRefTrait = <T extends object>(entity: Entity, trait: Trait<() => T>) => {
  const world = useWorld();
  const injectRef = useCallback(
    <CT extends T>(component: CT | null) => {
      if (!component) {
        return;
      }
      if (!world.has(entity)) return;
      entity.add(trait(component));
      return () => entity.remove(trait);
    },
    [entity],
  );

  return injectRef;
};
