import { PlayerStates } from "@/common/traits/PlayerStates.ts";
import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";
import { world } from "@/common/world.ts";

export const pressedTransformInput = () => {
  world.query(PlayerStates, SpriteAnim).updateEach(([states]) => {
    if (states.color === "black") {
      states.color = "white";
    }
    else {
      states.color = "black";
    }
  });
};
