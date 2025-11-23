import { world } from "@/common/world.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import { MoveInput } from "@/common/traits/MoveInput.ts";
import { ThreeRef } from "@/common/traits/ThreeRef.ts";

export const updateInteractionMoveInput = () => {
  const opponent = world.queryFirst(IsInteracting);
  if (!opponent) return;

  world.query(IsPlayer, MoveInput, ThreeRef).updateEach(([, moveInput, player]) => {
    const dst = Math.abs(opponent.get(ThreeRef)!.position.x - player.position.x);
    const dir = opponent.get(ThreeRef)!.position.x > player.position.x ? -1 : 1;
    const minDst = 4;

    if (dst < minDst) {
      moveInput.x = dir;
    }
  });
};
