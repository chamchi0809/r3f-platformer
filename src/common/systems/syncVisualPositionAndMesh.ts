import type { World } from "koota";
import { RootRef } from "@/common/traits/RootRef.ts";
import { CharacterVisualPosition } from "@/common/traits/CharacterVisualPosition.ts";

export const syncVisualPositionAndMesh = (world: World) => {
  world.query(CharacterVisualPosition, RootRef).updateEach(([position, root]) => {
    root.position.set(position.x, position.y, root.position.z);
  });
};
