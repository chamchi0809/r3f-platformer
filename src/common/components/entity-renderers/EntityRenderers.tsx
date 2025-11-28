import CameraView from "@/common/components/entity-views/CameraView.tsx";
import EnemyView from "@/common/components/entity-views/EnemyView.tsx";
import NPCView from "@/common/components/entity-views/NPCView.tsx";
import PlayerView from "@/common/components/entity-views/PlayerView.tsx";
import { InteractLine } from "@/common/traits/InteractLine";
import { IsCamera } from "@/common/traits/IsCamera.ts";
import { IsEnemy } from "@/common/traits/IsEnemy.ts";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { IsInteractionFocused } from "@/common/traits/IsInteractionFocused";
import { IsNPC } from "@/common/traits/IsNPC.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import { type Entity, Not, type QueryParameter } from "koota";
import { useQuery } from "koota/react";
import { Fragment, type JSX } from "react";
import { useUnmount } from "react-use";
import { InteractionLineView } from "../entity-views/InteractionLineView";
import InteractionHintView from "@/common/components/entity-views/InteractionHintView.tsx";
import BattleView from "@/common/components/entity-views/BattleView.tsx";
import { IsBattle } from "@/common/traits/IsBattle";
import { IsChat } from "@/common/traits/IsChat.ts";
import HealthBarView from "@/common/components/entity-views/HealthBarView";

/** Koota entity renderers */
export default function EntityRenderers() {
  return (
    <>
      <EntityRenderer params={[IsPlayer]} view={PlayerView} />
      <EntityRenderer params={[IsNPC]} view={NPCView} />
      <EntityRenderer params={[IsEnemy]} view={EnemyView} />
      <EntityRenderer params={[IsInteractionFocused, Not(IsInteracting)]} view={InteractionHintView} />
      <EntityRenderer params={[IsInteracting, IsChat, InteractLine]} view={InteractionLineView} />
      <EntityRenderer params={[IsCamera]} view={CameraView} />
      <EntityRenderer params={[IsInteracting, IsBattle]} view={BattleView} />
      <EntityRenderer params={[IsInteracting, IsBattle]} view={HealthBarView} />
    </>
  );
}

const EntityRenderer = <T extends QueryParameter[]>({
  params,
  view: View,
}: {
  params: T;
  view: (p: { entity: Entity }) => JSX.Element;
}) => {
  const entities = useQuery(...params);

  useUnmount(() => {
    entities.forEach((e) => e.destroy());
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
