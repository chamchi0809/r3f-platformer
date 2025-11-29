import { world } from "@/common/world.ts";
import { SpriteAnim } from "@/common/traits/SpriteAnim.ts";
import { BattleStartAnim } from "@/common/traits/BattleStartAnim.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { MoveInput } from "@/common/traits/MoveInput.ts";
import { IsBattle } from "@/common/traits/IsBattle.ts";

export const playBattleStartAnim = () => {
  const battleOpponent = world.queryFirst(IsInteracting, IsBattle);

  world.query(BattleStartAnim, SpriteAnim, MoveInput).updateEach(([battleStartAnim, spriteAnim, moveInput]) => {
    if (!battleOpponent) {
      battleStartAnim.playedOnce = false;
      battleStartAnim.playedReverse = false;
      return;
    }
    if (moveInput.x !== 0) return;
    if (spriteAnim.isPlaying(battleStartAnim)) return;
    if (spriteAnim.isPlaying({ ...battleStartAnim, reverse: true })) return;
    if (battleStartAnim.playedReverse) return;
    if (battleStartAnim.playedOnce) {
      spriteAnim.changeDef({ ...battleStartAnim, reverse: true });
      battleStartAnim.playedReverse = true;
      return;
    }

    spriteAnim.changeDef(battleStartAnim);
    battleStartAnim.playedOnce = true;
  });
};
