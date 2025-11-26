import { world } from "@/common/world.ts";
import { IdleAnim } from "@/common/traits/IdleAnim.ts";
import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";
import { MoveInput } from "@/common/traits/MoveInput.ts";
import { BattleStartAnim } from "@/common/traits/BattleStartAnim.ts";

export const playIdleAnim = () => {
  world.query(IdleAnim, SpriteAnim, MoveInput).updateEach(([idleAnim, spriteAnim, moveInput], entity) => {
    if (spriteAnim.isPlaying(idleAnim)) return;
    if (moveInput.x !== 0) return;

    if (entity.has(BattleStartAnim)) {
      const battleStartAnim = entity.get(BattleStartAnim)!;
      if (spriteAnim.isPlaying(battleStartAnim)) return;
      if (spriteAnim.isPlaying({ ...battleStartAnim, reverse: true })) return;
    }

    spriteAnim.changeDef(idleAnim);
  });
};
