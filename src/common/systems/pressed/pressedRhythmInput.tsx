import type { World } from "koota";
import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";

export const pressedRhythmInput = (world: World, index: 1 | 2 | 3 | 4) => {
  world.query(IsPlayer, SpriteAnim)
    .updateEach(([, anim]) => {
      switch (index) {
        case 1:
          anim.changeRange([0, 7]);
          anim.changePathGetter(() => "/assets/img/dancing/hips.png");
          anim.changeUVsGetter((i, len) => ([
            1 / len, i / len,
          ]));
          break;
        case 2:
          anim.changeRange([1, 4]);
          anim.changePathGetter(i => `/assets/img/dancing/slide${i}.png`);
          anim.changeUVsGetter(() => ([1, 0]));
          break;
        case 3:
          anim.changeRange([5, 8]);
          anim.changePathGetter(i => `/assets/img/dancing/slide${i}.png`);
          anim.changeUVsGetter(() => ([1, 0]));
          break;
        case 4:
          anim.changeRange([0, 7]);
          anim.changePathGetter(() => "/assets/img/dancing/hips.png");
          anim.changeUVsGetter((i, len) => ([
            1 / len, i / len,
          ]));
          break;
      }
    });
};
