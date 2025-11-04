import type { World } from "koota";

import { MoveInput } from "@/common/traits/MoveInput.ts";
import { CharacterStats } from "@/common/traits/CharacterStats.ts";
import { CharacterVelocity } from "@/common/traits/CharacterValues.ts";

export const updateCharacterVelocity = (world: World) => {
  world.query(MoveInput, CharacterVelocity, CharacterStats.speed).updateEach(([moveInput, velocity, speed]) => {
    velocity.set(moveInput.x * speed, velocity.y);
  });
};
