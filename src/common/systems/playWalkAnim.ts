import { world } from "@/common/world.ts";
import { WalkAnim } from "@/common/traits/WalkAnim.ts";
import { MoveInput } from "@/common/traits/MoveInput.ts";
import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";

export const playWalkAnim = () => {
  world.query(WalkAnim, MoveInput, SpriteAnim).updateEach(([walkAnim, moveInput, spriteAnim]) => {
    if (spriteAnim.isPlaying(walkAnim)) return;
    if (moveInput.x === 0) return;
    spriteAnim.changeDef(walkAnim);
  });
};
