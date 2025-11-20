import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";
import type { World } from "koota";
import { MaterialRef } from "@/common/traits/MaterialRef.ts";
import { MeshRef } from "@/common/traits/MeshRef.ts";

export const applySpriteAnim = (world: World) => {
  world.query(MeshRef, MaterialRef, SpriteAnim).updateEach(([mesh, mat, spriteAnim]) => {
    const map = spriteAnim.getCurrentFrameTexture();
    const frameWidthPortion = 1 / spriteAnim.length;
    const aspectRatio = map ? (map.width * frameWidthPortion) / map.height : 1;
    mat.map = map;
    mesh.scale.setX(1 * aspectRatio);
  });
};
