import type { Entity, Trait } from "koota";
import { useWorld } from "koota/react";
import { useCallback } from "react";

/**
 * A hook that injects a trait with a reference to an entity.
 *
 * @param entity - The entity to which the trait will be added.
 * @param trait - The trait to be added to the entity.
 * @returns A function that takes a component reference and adds the trait to the entity.
 */
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
