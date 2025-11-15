import { useEffect } from "react";
import { useWorld } from "koota/react";
import type { EntityRendererProps } from "@/common/ldtk/components/layers/EntitiesLayerRenderer.tsx";
import { getEntityWorldPosition } from "@/common/ldtk/utils/positionUtils.ts";
import { Vector2 } from "three";
import { useLdtkLevelContext } from "@/common/ldtk/components/LdtkMap.tsx";
import { stripEntityInstanceFields } from "@/common/ldtk/utils/entityUtils.ts";
import { IsNPC } from "@/common/traits/IsNPC.ts";
import { CharacterStartPosition } from "@/common/traits/CharacterStartPosition.ts";
import { CharacterVisualPosition } from "@/common/traits/CharacterVisualPosition.ts";
import { SpriteAnim, SpriteAnimImpl } from "@/common/traits/SpriteAnim.ts";

export default function NPCSpawner(props: EntityRendererProps) {
  const { ldtkDir } = useLdtkLevelContext();
  const world = useWorld();
  const worldPos = getEntityWorldPosition(props);

  useEffect(() => {
    const startPosition = new Vector2(worldPos[0], worldPos[1]).add(new Vector2(0, 0.5));

    const {
      Idle,
    } = stripEntityInstanceFields<{
      Idle: string
    }>(props.entity);

    world.spawn(
      IsNPC,
      CharacterStartPosition(startPosition.clone()), CharacterVisualPosition(startPosition.clone()),
      SpriteAnim(new SpriteAnimImpl({
        path: `${ldtkDir}${Idle.trim()}`,
        length: 8,
        loop: true,
      })),
    );
  }, []);

  return <></>;
}
