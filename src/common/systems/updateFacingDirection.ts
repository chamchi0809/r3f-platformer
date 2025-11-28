import { world } from "@/common/world.ts";
import { MoveInput } from "@/common/traits/MoveInput.ts";
import { CharacterFacingDirection } from "@/common/traits/CharacterFacingDirection.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import { ThreeRef } from "@/common/traits/ThreeRef.ts";

export const updateFacingDirection = () => {
  const player = world.queryFirst(IsPlayer);
  const opponent = world.queryFirst(IsInteracting);
  world.query(CharacterFacingDirection).updateEach(([facingDirection], entity) => {
    if (entity.has(IsPlayer)) {
      const moveInput = entity.get(MoveInput);
      if (moveInput && moveInput.x !== 0) {
        facingDirection.value = Math.sign(moveInput.x);
        return;
      }

      if (opponent) {
        const playerPos = entity.get(ThreeRef)!.position.x;
        const opponentPos = opponent.get(ThreeRef)!.position.x;
        const dir = Math.sign(opponentPos - playerPos);
        facingDirection.value = dir;
      }
      return;
    }

    if (entity.has(IsInteracting)) {
      if (player) {
        const opponentPos = entity.get(ThreeRef)!.position.x;
        const playerPos = player.get(ThreeRef)!.position.x;
        const dir = Math.sign(playerPos - opponentPos);
        facingDirection.value = dir;
      }
      return;
    }
  });
};
