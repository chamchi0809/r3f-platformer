import { InteractLine } from "@/common/traits/InteractLine";
import { IsBattle } from "@/common/traits/IsBattle.ts";
import { IsEnemy } from "@/common/traits/IsEnemy.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { IsInteractionFocused } from "@/common/traits/IsInteractionFocused.ts";
import { world } from "@/common/world.ts";

export const pressedInteractInput = () => {
  world
    .query(IsInteractionFocused, InteractLine)
    .updateEach(([line], entity) => {
      if (!entity.has(IsInteracting)) {
        entity.add(IsInteracting);
        return;
      }

      const currentText = line.lines[line.current] ?? "";
      const isAnimating = line.animIndex < currentText.length;
      if (isAnimating) {
        line.animIndex = currentText.length;
        line.animDelta = 0;
        return;
      }

      const isLastLine = line.current + 1 >= line.lines.length;
      if (isLastLine) {
        entity.remove(IsInteracting);
        line.current = 0;
        line.animIndex = 0;
        line.animDelta = 0;

        if (entity.has(IsEnemy)) {
          entity.add(IsBattle);
        }
        return;
      }

      line.current += 1;
      line.animIndex = 0;
      line.animDelta = 0;
    });
};
