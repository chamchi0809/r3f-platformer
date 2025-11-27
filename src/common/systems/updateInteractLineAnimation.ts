import { InteractLine } from "@/common/traits/InteractLine";
import { IsInteracting } from "@/common/traits/IsInteracting";
import type { World } from "koota";

const ANIM_INTERVAL = 0.05;

export const updateInteractLineAnimation = (world: World, delta: number) => {
  world.query(IsInteracting, InteractLine).updateEach(([interactLine]) => {
    const line = interactLine.lines[interactLine.current];
    if (!line) return;
    if (interactLine.animIndex >= line.length) return;
    interactLine.animDelta += delta;
    if (interactLine.animDelta >= ANIM_INTERVAL) {
      interactLine.animDelta = 0;
      interactLine.animIndex += 1;
    }
  });
};
