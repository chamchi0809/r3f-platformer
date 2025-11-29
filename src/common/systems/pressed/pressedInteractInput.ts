import { InteractLine } from "@/common/traits/InteractLine";
import { IsBattle } from "@/common/traits/IsBattle.ts";
import { IsEnemy } from "@/common/traits/IsEnemy.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { IsInteractionFocused } from "@/common/traits/IsInteractionFocused.ts";
import { world } from "@/common/world.ts";
import { IsChat } from "@/common/traits/IsChat.ts";
import { Not } from "koota";
import { IsNPC } from "@/common/traits/IsNPC.ts";
import { HealthPoint } from "@/common/traits/HealthPoint";
import { HealthSystem } from "@/common/systems/health";

export const pressedInteractInput = () => {
  world.query(IsInteractionFocused, Not(IsInteracting)).updateEach((_, entity) => {
    if (!entity.has(IsInteracting)) {
      entity.add(IsInteracting);
      entity.add(IsChat);
      return;
    }
  });

  world.query(IsInteracting, IsChat, InteractLine).updateEach(([line], entity) => {
    const currentText = line.lines[line.current] ?? "";
    const isAnimating = line.animIndex < currentText.length;
    if (isAnimating) {
      line.animIndex = currentText.length;
      line.animDelta = 0;
      return;
    }

    const isLastLine = line.current + 1 >= line.lines.length;
    if (isLastLine) {
      entity.remove(IsChat);
      line.current = 0;
      line.animIndex = 0;
      line.animDelta = 0;

      if (entity.has(IsNPC)) {
        entity.remove(IsInteracting);
      }
      if (entity.has(IsEnemy)) {
        entity.add(HealthPoint);
        entity.add(IsBattle);
      }
      return;
    }

    line.current += 1;
    line.animIndex = 0;
    line.animDelta = 0;
  });

  HealthSystem.from(world).init();
};
