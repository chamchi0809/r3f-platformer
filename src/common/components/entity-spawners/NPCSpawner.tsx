import { INTERACTION_GROUPS } from "@/common/defs/colGroup.ts";
import useCreateCollider from "@/common/hooks/physics/useCreateCollider.ts";
import useRapier from "@/common/hooks/physics/useRapier.ts";
import type { EntityRendererProps } from "@/common/ldtk/components/layers/EntitiesLayerRenderer.tsx";
import { useLdtkLevelContext } from "@/common/ldtk/components/LdtkMap.tsx";
import { stripEntityInstanceFields } from "@/common/ldtk/utils/entityUtils.ts";
import { getEntityWorldPosition } from "@/common/ldtk/utils/positionUtils.ts";
import { CharacterStartPosition } from "@/common/traits/CharacterStartPosition.ts";
import { CharacterVisualPosition } from "@/common/traits/CharacterVisualPosition.ts";
import { Interactable, InteractableRef } from "@/common/traits/InteractableRef.ts";
import { InteractLine } from "@/common/traits/InteractLine";
import { IsNPC } from "@/common/traits/IsNPC.ts";
import { SpriteAnim, SpriteAnimImpl } from "@/common/traits/SpriteAnim.ts";
import { useWorld } from "koota/react";
import { useEffect } from "react";
import { Vector2 } from "three";
import { CharacterFacingDirection } from "@/common/traits/CharacterFacingDirection.ts";
import { MoveInput } from "@/common/traits/MoveInput.ts";
import { IdleAnim } from "@/common/traits/IdleAnim.ts";

export default function NPCSpawner(props: EntityRendererProps) {
  const { ldtkDir } = useLdtkLevelContext();
  const world = useWorld();
  const { rapier, world: rapierWorld } = useRapier();
  const worldPos = getEntityWorldPosition(props);
  const startPosition = new Vector2(worldPos[0], worldPos[1]).add(new Vector2(0, 0.5));

  const {
    Idle,
    IdleLength,
    SensorWidth,
    SensorHeight,
    Lines,
  } = stripEntityInstanceFields<{
    Idle: string
    IdleLength: number
    SensorWidth: number
    SensorHeight: number
    Lines: string[]
  }>(props.entity);

  const sensor = useCreateCollider({
    startPosition,
    colliderDesc: rapier.ColliderDesc.cuboid(SensorWidth / 2, SensorHeight / 2)
      .setCollisionGroups(INTERACTION_GROUPS.SENSOR)
      .setSensor(true),
  });

  useEffect(() => {
    if (!sensor) return;
    world.spawn(
      IsNPC,
      MoveInput,
      CharacterStartPosition(startPosition.clone()), CharacterVisualPosition(startPosition.clone()),
      CharacterFacingDirection,
      InteractableRef(new Interactable(sensor, rapierWorld)),
      InteractLine({ lines: Lines }),
      SpriteAnim(new SpriteAnimImpl({
        path: `${ldtkDir}${Idle.trim()}`,
        length: 8,
        loop: true,
      })),
      IdleAnim({
        path: `${ldtkDir}${Idle.trim()}`,
        length: IdleLength,
        loop: true,
      }),
    );
  }, [sensor]);

  return <></>;
}
