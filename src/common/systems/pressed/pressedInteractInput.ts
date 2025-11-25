import { InteractLine } from "@/common/traits/InteractLine";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { IsInteractionFocused } from "@/common/traits/IsInteractionFocused.ts";
import { world } from "@/common/world.ts";

export const pressedInteractInput = () => {
  world
    .query(IsInteractionFocused, InteractLine)
    .updateEach(([InteractLine], entity) => {
      if (entity.has(IsInteracting)) {
        const currentText = InteractLine.lines[InteractLine.current] ?? "";
        const isAnimating = InteractLine.animIndex < currentText.length;

        if (isAnimating) {
          InteractLine.animIndex = currentText.length;
          InteractLine.animDelta = 0;
        }
        else if (InteractLine.current + 1 >= InteractLine.lines.length) {
          entity.remove(IsInteracting);
          InteractLine.current = 0;
          InteractLine.animIndex = 1;
          InteractLine.animDelta = 1;
        }
        else {
          InteractLine.current += 1;
          InteractLine.animIndex = 1;
          InteractLine.animDelta = 1;
        }
      }
      else {
        entity.add(IsInteracting);
      }
    });
};
