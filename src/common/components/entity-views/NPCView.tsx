import type { Entity } from "koota";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait.ts";
import { ThreeRef } from "@/common/traits/ThreeRef.ts";
import { MaterialRef } from "@/common/traits/MaterialRef.ts";

export default function NPCView({ entity }: { entity: Entity }) {
  const threeRef = useRefTrait(entity, ThreeRef);
  const materialRef = useRefTrait(entity, MaterialRef);

  return (
    <group ref={threeRef}>
      <group position-z={1}>
        <mesh>
          <planeGeometry args={[1.6, 2, 1]} />
          <meshLambertMaterial color="white" ref={materialRef} transparent />
        </mesh>
      </group>
    </group>
  );
};
