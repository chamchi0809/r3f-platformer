import type { World } from "koota";
import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";

export const pressedRhythmInput = (world: World, index: 1 | 2 | 3 | 4) => {
  world.query(IsPlayer, SpriteAnim)
    .updateEach(([, anim]) => {
      switch (index) {
        case 1:
          anim.changeLength(8);
          anim.changePath("/assets/img/dancing/hips.png");
          break;
        case 2:
          anim.changeLength(8);
          anim.changePath("/assets/img/dancing/hips.png");
          break;
        case 3:
          anim.changeLength(8);
          anim.changePath("/assets/img/dancing/hips.png");
          break;
        case 4:
          anim.changeLength(8);
          anim.changePath("/assets/img/dancing/hips.png");
          break;
      }
    });
};
