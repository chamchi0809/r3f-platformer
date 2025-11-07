import type { World } from "koota";
import { JumpInput } from "@/common/traits/JumpInput.ts";
import { CharacterJumpBuffer } from "@/common/traits/CharacterValues.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import { Elapsed } from "@/common/traits/Elapsed.ts";

export const addJumpBuffer = (world: World) => {
  world.query(IsPlayer, JumpInput).updateEach(([, input], entity) => {
    if (input.on && !entity.has(CharacterJumpBuffer)) {
      entity.add(CharacterJumpBuffer({ time: world.get(Elapsed)!.value, duration: 0.2 }));
    }
  });
};
