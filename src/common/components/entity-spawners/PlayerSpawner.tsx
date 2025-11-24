import useCreateCollider from "@/common/hooks/physics/useCreateCollider.ts";
import useRapier from "@/common/hooks/physics/useRapier.ts";
import type { EntityRendererProps } from "@/common/ldtk/components/layers/EntitiesLayerRenderer.tsx";
import { getEntityWorldPosition } from "@/common/ldtk/utils/positionUtils.ts";
import { CharacterController, CharacterControllerRef } from "@/common/traits/CharacterControllerRef.ts";
import { CharacterStartPosition } from "@/common/traits/CharacterStartPosition.ts";
import { CharacterStats } from "@/common/traits/CharacterStats.ts";
import { CharacterVelocity } from "@/common/traits/CharacterValues.ts";
import { CharacterVisualPosition } from "@/common/traits/CharacterVisualPosition.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import { JumpInput } from "@/common/traits/JumpInput.ts";
import { MoveInput } from "@/common/traits/MoveInput.ts";
import { PlayerStates } from "@/common/traits/PlayerStates.ts";
import { SpriteAnim, SpriteAnimImpl } from "@/common/traits/SpriteAnim.ts";
import { useWorld } from "koota/react";
import { useEffect } from "react";
import { Vector2 } from "three";
import { INTERACTION_GROUPS } from "@/common/defs/colGroup.ts";

export default function PlayerSpawner(props: EntityRendererProps) {
  const worldPos = getEntityWorldPosition(props);
  const world = useWorld();
  const startPosition = new Vector2(worldPos[0], worldPos[1]).add(new Vector2(0, 0.5));

  const { rapier, world: rapierWorld } = useRapier();
  const collider = useCreateCollider({
    startPosition: startPosition.clone(),
    colliderDesc: rapier.ColliderDesc.cuboid(0.8, 1)
      .setCollisionGroups(INTERACTION_GROUPS.CHARACTER),
  });

  useEffect(() => {
    if (!collider) return;

    world.spawn(
      IsPlayer, PlayerStates,
      MoveInput(new Vector2(0, 0)), JumpInput,
      CharacterStartPosition(startPosition.clone()), CharacterVisualPosition(startPosition.clone()), CharacterVelocity,
      CharacterStats.speed(5), CharacterStats.jumpStrength(12),
      SpriteAnim(new SpriteAnimImpl({
        path: "/assets/img/hiphopboy/hiphopboy_dance1.png",
        length: 5,
      })),
      CharacterControllerRef(new CharacterController(collider, rapierWorld)),
    );
  }, [collider]);

  return <></>;
}
