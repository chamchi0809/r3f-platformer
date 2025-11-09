import type { World } from "koota";
import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";

export const pressedRhythmInput = (world: World, index: 1 | 2 | 3 | 4) => {
  world.query(IsPlayer, SpriteAnim)
    .updateEach(([, anim]) => {
      switch (index) {
        case 1:
          anim.changeRange([2, 5]);
          anim.changePathGetter(i => `/assets/img/dancing/hips${i}.png`);
          break;
        case 2:
          anim.changeRange([1, 4]);
          anim.changePathGetter(i => `/assets/img/dancing/slide${i}.png`);
          break;
        case 3:
          anim.changeRange([5, 8]);
          anim.changePathGetter(i => `/assets/img/dancing/slide${i}.png`);
          break;
        case 4:
          anim.changeRange([6, 9]);
          anim.changePathGetter(i => `/assets/img/dancing/hips${i}.png`);
          break;
      }
    });
};
