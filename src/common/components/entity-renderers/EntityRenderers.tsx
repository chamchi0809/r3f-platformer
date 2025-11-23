import { useQuery } from "koota/react";
import { type Entity, Not, type QueryParameter } from "koota";
import { Fragment, type JSX } from "react";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import PlayerView from "@/common/components/entity-views/PlayerView.tsx";
import { useUnmount } from "react-use";
import { IsNPC } from "@/common/traits/IsNPC.ts";
import { IsEnemy } from "@/common/traits/IsEnemy.ts";
import NPCView from "@/common/components/entity-views/NPCView.tsx";
import EnemyView from "@/common/components/entity-views/EnemyView.tsx";
import { IsCamera } from "@/common/traits/IsCamera.ts";
import CameraView from "@/common/components/entity-views/CameraView.tsx";
import { IsInteractionFocused } from "@/common/traits/IsInteractionFocused";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import InteractionHintView from "@/common/components/entity-views/InteractionHintView.tsx";

/** Koota entity renderers */
export default function EntityRenderers() {
  return (
    <>
      <EntityRenderer
        params={[IsPlayer]}
        view={PlayerView}
      />
      <EntityRenderer
        params={[IsNPC]}
        view={NPCView}
      />
      <EntityRenderer
        params={[IsEnemy]}
        view={EnemyView}
      />
      <EntityRenderer
        params={[IsInteractionFocused, Not(IsInteracting)]}
        view={InteractionHintView}
      />
      <EntityRenderer
        params={[IsCamera]}
        view={CameraView}
      />
    </>
  );
}

const EntityRenderer = <T extends QueryParameter[]>(
  {
    params,
    view: View,
  }: {
    params: T
    view: (p: { entity: Entity }) => JSX.Element
  }) => {
  const entities = useQuery(...params);

  useUnmount(() => {
    entities.forEach(e => e.destroy());
  });

  return (
    <>
      {entities.map((entity) => {
        return (
          <Fragment key={entity.id()}>
            <View entity={entity} />
          </Fragment>
        );
      })}
    </>
  );
};
