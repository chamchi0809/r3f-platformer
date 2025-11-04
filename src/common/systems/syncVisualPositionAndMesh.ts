import type { World } from "koota";
import { ThreeRef } from "@/common/traits/ThreeRef.ts";
import { CharacterVisualPosition } from "@/common/traits/CharacterVisualPosition.ts";

export const syncVisualPositionAndMesh = (world: World) => {
  world.query(CharacterVisualPosition, ThreeRef).updateEach(([position, threeRef]) => {
    threeRef.position.set(position.x, position.y, threeRef.position.z);
  });
};
