import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";
import type { World } from "koota";
import { MaterialRef } from "@/common/traits/MaterialRef.ts";

export const applySpriteAnim = (world: World) => {
  world.query(MaterialRef, SpriteAnim).updateEach(([mat, spriteAnim]) => {
    mat.map = spriteAnim.getCurrentFrameTexture();
  });
};
