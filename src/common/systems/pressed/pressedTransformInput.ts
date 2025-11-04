import type { World } from "koota";
import { PlayerStates } from "@/common/traits/PlayerStates.ts";

export const pressedTransformInput = (world: World) => {
  world.query(PlayerStates).updateEach(([states]) => {
    states.color = states.color === "black" ? "white" : "black";
  });
};
