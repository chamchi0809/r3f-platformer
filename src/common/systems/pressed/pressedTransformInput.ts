import type { World } from "koota";
import { PlayerStates } from "@/common/traits/PlayerStates.ts";
import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";

export const pressedTransformInput = (world: World) => {
  world.query(PlayerStates, SpriteAnim).updateEach(([states, anim]) => {
    if (states.color === "black") {
      states.color = "white";
      anim.changeRange([3, 5]);
    }
    else {
      states.color = "black";
      anim.changeRange([6, 8]);
    }
  });
};
