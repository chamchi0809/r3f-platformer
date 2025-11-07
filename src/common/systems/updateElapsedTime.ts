import { Elapsed } from "@/common/traits/Elapsed.ts";
import type { World } from "koota";

export const updateElapsedTime = (world: World, delta: number) => {
  world.set(Elapsed, {
    value: world.get(Elapsed)!.value + delta,
  });
  world.query(Elapsed).updateEach(([elapsed]) => {
    elapsed.value += delta;
  });
};
