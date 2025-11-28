import { world } from "@/common/world.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import { MoveInput } from "@/common/traits/MoveInput.ts";
import { RootRef } from "@/common/traits/RootRef.ts";

export const updateInteractionMoveInput = () => {
  const opponent = world.queryFirst(IsInteracting);
  if (!opponent) return;

  world.query(IsPlayer, MoveInput, RootRef).updateEach(([, moveInput, player]) => {
    const dst = Math.abs(opponent.get(RootRef)!.position.x - player.position.x);
    const dir = opponent.get(RootRef)!.position.x > player.position.x ? -1 : 1;
    const minDst = 4;

    if (dst < minDst) {
      moveInput.x = dir;
    }
  });
};
