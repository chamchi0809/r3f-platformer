import { useEffect } from "react";
import { useActions } from "koota/react";
import { actions } from "@/common/actions.ts";
import type { EntityRendererProps } from "@/common/ldtk/components/layers/EntitiesLayerRenderer.tsx";
import { getEntityWorldPosition } from "@/common/ldtk/utils/positionUtils.ts";
import { Vector2 } from "three";
import { useLdtkLevelContext } from "@/common/ldtk/components/LdtkMap.tsx";

export default function NPCSpawner(props: EntityRendererProps) {
  const { ldtkDir } = useLdtkLevelContext();
  const worldPos = getEntityWorldPosition(props);
  const { spawnNPC } = useActions(actions);

  useEffect(() => {
    spawnNPC({
      startPosition: new Vector2(worldPos[0], worldPos[1]).add(new Vector2(0, 1)),
      ldtkDir,
      entityInstance: props.entity,
    });
  }, []);

  return <></>;
}
