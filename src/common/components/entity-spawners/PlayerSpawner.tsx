import { useWorld } from "koota/react";
import { useEffect } from "react";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import type { EntityRendererProps } from "@/common/ldtk/components/layers/EntitiesLayerRenderer.tsx";
import { getEntityWorldPosition } from "@/common/ldtk/utils/positionUtils.ts";
import { Vector2 } from "three";
import { PlayerStates } from "@/common/traits/PlayerStates.ts";
import { MoveInput } from "@/common/traits/MoveInput.ts";
import { JumpInput } from "@/common/traits/JumpInput.ts";
import { CharacterStartPosition } from "@/common/traits/CharacterStartPosition.ts";
import { CharacterVisualPosition } from "@/common/traits/CharacterVisualPosition.ts";
import { CharacterVelocity } from "@/common/traits/CharacterValues.ts";
import { CharacterStats } from "@/common/traits/CharacterStats.ts";
import { SpriteAnim, SpriteAnimImpl } from "@/common/traits/SpriteAnim.ts";

export default function PlayerSpawner(props: EntityRendererProps) {
  const worldPos = getEntityWorldPosition(props);
  const world = useWorld();

  useEffect(() => {
    const startPosition = new Vector2(worldPos[0], worldPos[1]).add(new Vector2(0, 0.5));

    world.spawn(
      IsPlayer, PlayerStates,
      MoveInput(new Vector2(0, 0)), JumpInput,
      CharacterStartPosition(startPosition.clone()), CharacterVisualPosition(startPosition.clone()), CharacterVelocity,
      CharacterStats.speed(5), CharacterStats.jumpStrength(12),
      SpriteAnim(new SpriteAnimImpl({
        path: "/assets/img/dancing/hips.png",
        length: 8,
      })),
    );
  }, []);

  return <></>;
}
