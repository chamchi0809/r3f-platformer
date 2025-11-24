export default function BattleView() {
  return <></>;
import type { Entity } from "koota";
import { useTrait } from "koota/react";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { Html } from "@react-three/drei";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait";
import { BattleViewRef } from "@/common/traits/BattleViewRef";
export default function BattleView({ entity }: { entity: Entity }) {
  const type = useTrait(entity, IsInteracting)?.type;
  const battleViewRef = useRefTrait(entity, BattleViewRef);

  if (type !== "battle") return <></>;

  return (
    <group ref={battleViewRef}>
      <Html fullscreen>
        <h1>hello</h1>
      </Html>
    </group>
  );
}
