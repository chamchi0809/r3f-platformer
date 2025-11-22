import { world } from "@/common/world.ts";
import { IsInteractionFocused } from "@/common/traits/IsInteractionFocused.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { Not } from "koota";

export const pressedInteractInput = () => {
  world.query(IsInteractionFocused, Not(IsInteracting)).forEach((entity) => {
    entity.add(IsInteracting);
  });
};
