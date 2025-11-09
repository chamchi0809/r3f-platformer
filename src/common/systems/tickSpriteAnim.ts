import type { World } from "koota";
import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";

export const tickSpriteAnim = (world: World) => {
  world.query(SpriteAnim).updateEach(([spriteAnim]) => {
    spriteAnim.tick(world);
  });
};
