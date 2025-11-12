import { useWorld } from "koota/react";
import { useEffect } from "react";
import type { Entity } from "koota";
import useRapier from "@/common/hooks/physics/useRapier.ts";
import type { Collider } from "@dimforge/rapier2d";
import { Interactable, InteractableRef } from "@/common/traits/InteractableRef.ts";

export const useInteractableInjector = (
  entity: Entity,
  collider: Collider | undefined,
) => {
  const world = useWorld();
  const { world: rapierWorld } = useRapier();

  useEffect(() => {
    if (!world.has(entity)) return;
    if (collider) {
      entity.add(InteractableRef(new Interactable(collider, rapierWorld)));
    }
    return () => {
      entity.remove(InteractableRef);
    };
  }, [collider]);
};
