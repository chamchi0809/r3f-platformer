import { useActions, useWorld } from "koota/react";
import { useEffect } from "react";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import type { EntityRendererProps } from "@/common/ldtk/components/layers/EntitiesLayerRenderer.tsx";
import { getEntityWorldPosition } from "@/common/ldtk/utils/positionUtils.ts";
import { actions } from "@/common/actions.ts";
import { Vector2 } from "three";

export default function PlayerSpawner(props: EntityRendererProps) {
  const worldPos = getEntityWorldPosition(props);
  const world = useWorld();
  const { spawnPlayer } = useActions(actions);

  useEffect(() => {
    const player = world.queryFirst(IsPlayer);
    if (!player) {
      spawnPlayer(new Vector2(worldPos[0], worldPos[1]));
    }
  }, []);

  return <></>;
}
