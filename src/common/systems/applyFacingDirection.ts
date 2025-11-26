import { world } from "@/common/world.ts";
import { CharacterFacingDirection } from "@/common/traits/CharacterFacingDirection.ts";
import { ThreeRef } from "@/common/traits/ThreeRef.ts";

export const applyFacingDirection = () => {
  world.query(CharacterFacingDirection, ThreeRef).updateEach(([dir, three]) => {
    three.scale.set(dir.value, 1, 1);
  });
};
