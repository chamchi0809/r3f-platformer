import { InteractLine } from "@/common/traits/InteractLine";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { IsInteractionFocused } from "@/common/traits/IsInteractionFocused.ts";
import { world } from "@/common/world.ts";

export const pressedInteractInput = () => {
  world
    .query(IsInteractionFocused, InteractLine)
    .updateEach(([InteractLine], entity) => {
      if (entity.has(IsInteracting)) {
        if (InteractLine.current + 1 >= InteractLine.lines.length) {
          entity.remove(IsInteracting);
          InteractLine.current = 0;
          InteractLine.animIndex = 0;
          InteractLine.animDelta = 0;
        }
        else {
          InteractLine.current += 1;
          InteractLine.animIndex = 0;
          InteractLine.animDelta = 0;
        }
      }
      else {
        entity.add(IsInteracting);
      }
    });
};
