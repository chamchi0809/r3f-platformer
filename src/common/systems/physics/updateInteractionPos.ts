import { CharacterVisualPosition } from "@/common/traits/CharacterVisualPosition";
import { InteractableRef } from "@/common/traits/InteractableRef";
import { InteractionRef } from "@/common/traits/InteractionRef";
import { IsInteractionFocused } from "@/common/traits/IsInteractionFocused";
import type { World } from "koota";

export const updateInteractionPos = (world: World) => {
  const focusedEntityPos = world
    .queryFirst(IsInteractionFocused, InteractableRef)
    ?.get(CharacterVisualPosition);
  if (!focusedEntityPos) return;
  world
    .query(IsInteractionFocused, InteractionRef)
    .updateEach(([interactionRef]) => {
      const pos = interactionRef.position;
      interactionRef.position.set(focusedEntityPos.x, focusedEntityPos.y, pos.z);
    });
};
