import type { World } from "koota";
import { PlayerStates } from "@/common/traits/PlayerStates.ts";
import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";

export const pressedTransformInput = (world: World) => {
  world.query(PlayerStates, SpriteAnim).updateEach(([states]) => {
    if (states.color === "black") {
      states.color = "white";
    }
    else {
      states.color = "black";
    }
  });
};
