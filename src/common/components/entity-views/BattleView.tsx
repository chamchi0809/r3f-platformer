import type { Entity } from "koota";
import { useTrait } from "koota/react";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";

export default function BattleView({ entity }: { entity: Entity }) {
  const type = useTrait(entity, IsInteracting)?.type;

  if (type !== "battle") return <></>;
}
