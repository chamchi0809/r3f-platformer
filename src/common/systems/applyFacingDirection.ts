import { world } from "@/common/world.ts";
import { CharacterFacingDirection } from "@/common/traits/CharacterFacingDirection.ts";
import { RootRef } from "@/common/traits/RootRef.ts";

export const applyFacingDirection = () => {
  world.query(CharacterFacingDirection, RootRef).updateEach(([dir, root]) => {
    root.scale.set(dir.value, 1, 1);
  });
};
