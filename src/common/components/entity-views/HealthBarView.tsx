import { useRefTrait } from "@/common/hooks/ecs/useRefTrait";
import { InteractionRef } from "@/common/traits/InteractionRef";
import { Html } from "@react-three/drei";
import type { Entity } from "koota";

export default function HealthBarView({ entity }: { entity: Entity }) {
  const interactionRef = useRefTrait(entity, InteractionRef);

  return (
    <group ref={interactionRef}>
      <Html>
        <div style={{ width: "100px", background: "white" }}>섹스</div>
      </Html>
    </group>
  );
}
