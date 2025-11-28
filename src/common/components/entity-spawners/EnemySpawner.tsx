import { useEffect } from "react";
import { useWorld } from "koota/react";
import type { EntityRendererProps } from "@/common/ldtk/components/layers/EntitiesLayerRenderer.tsx";
import { getEntityWorldPosition } from "@/common/ldtk/utils/positionUtils.ts";
import { Vector2 } from "three";
import { useLdtkLevelContext } from "@/common/ldtk/components/LdtkMap.tsx";
import { stripEntityInstanceFields } from "@/common/ldtk/utils/entityUtils.ts";
import { CharacterStartPosition } from "@/common/traits/CharacterStartPosition.ts";
import { CharacterVisualPosition } from "@/common/traits/CharacterVisualPosition.ts";
import { SpriteAnim, SpriteAnimImpl } from "@/common/traits/SpriteAnim.ts";
import { IsEnemy } from "@/common/traits/IsEnemy.ts";
import useCreateCollider from "@/common/hooks/physics/useCreateCollider.ts";
import useRapier from "@/common/hooks/physics/useRapier.ts";
import { INTERACTION_GROUPS } from "@/common/defs/colGroup.ts";
import { Interactable, InteractableRef } from "@/common/traits/InteractableRef.ts";
import { CharacterFacingDirection } from "@/common/traits/CharacterFacingDirection.ts";
import { InteractLine } from "@/common/traits/InteractLine.ts";

export default function EnemySpawner(props: EntityRendererProps) {
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
      IsEnemy,
      CharacterStartPosition(startPosition.clone()), CharacterVisualPosition(startPosition.clone()),
      CharacterFacingDirection,
      SpriteAnim(new SpriteAnimImpl({
        path: `${ldtkDir}${Idle.trim()}`,
        length: IdleLength,
        loop: true,
      })),
      InteractableRef(new Interactable(sensor, rapierWorld)),
      InteractLine({ lines: Lines }),
    );
  }, [sensor]);

  return <></>;
}
