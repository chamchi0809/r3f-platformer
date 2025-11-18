import { CharacterControllerRef } from "@/common/traits/CharacterControllerRef";
import { InteractableRef } from "@/common/traits/InteractableRef";
import { IsInteractionFocused } from "@/common/traits/IsInteractionFocused";
import { IsPlayer } from "@/common/traits/IsPlayer";
import type { Entity, World } from "koota";

export const updateInteractionFocus = (world: World) => {
  const playerCol = world
    .queryFirst(IsPlayer)
    ?.get(CharacterControllerRef)
    ?.col;
  if (!playerCol) return;

  let closestEntity = null as Entity | null;
  let closestDist: number = Infinity;

  world
    .query(InteractableRef)
    .updateEach(([interactableRef], entity) => {
      if (!interactableRef.isIntersecting(playerCol)) return;
      if (!closestEntity) return closestEntity = entity;
      const playerPos = playerCol.translation();
      const pos = interactableRef.collider.translation();
      const dx = pos.x - playerPos.x;
      const dy = pos.y - playerPos.y;
      const dist = dx * dx + dy * dy;
      if (dist < closestDist) {
        closestEntity = entity;
        closestDist = dist;
      }
    });
  world
    .query(IsInteractionFocused)
    .updateEach((_, entity) => entity.remove(IsInteractionFocused));

  if (closestEntity) closestEntity.add(IsInteractionFocused);
};
