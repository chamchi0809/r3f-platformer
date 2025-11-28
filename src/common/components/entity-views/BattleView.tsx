export default function BattleView() {
  return <></>;
import type { Entity } from "koota";
import { useTrait } from "koota/react";
import { IsInteracting } from "@/common/traits/IsInteracting.ts";
import { Html, Svg } from "@react-three/drei";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait";
import { BattleViewRef } from "@/common/traits/BattleViewRef";
import ArrowSvg from "@/assets/ui/battle/filled-arrow.svg";

export default function BattleView({ entity }: { entity: Entity }) {
  const type = useTrait(entity, IsInteracting)?.type;
  const battleViewRef = useRefTrait(entity, BattleViewRef);

  if (type !== "battle") return <></>;

  return (
    <group ref={battleViewRef}>
      <Svg
        position={[0, 0, 0]}
        src={`<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" height="10px" width="10px" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 15 L85 50 L70 50 L70 90 L30 90 L30 50 L15 50 Z" />
</svg>`}
      />
    </group>
  );
}
