import type { Entity } from "koota";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait.ts";
import { ThreeRef } from "@/common/traits/ThreeRef.ts";
import { MaterialRef } from "@/common/traits/MaterialRef.ts";
import { MeshRef } from "@/common/traits/MeshRef.ts";

export default function NPCView({ entity }: { entity: Entity }) {
  return (
    <group ref={useRefTrait(entity, ThreeRef)}>
      <group position-z={1}>
        <mesh ref={useRefTrait(entity, MeshRef)}>
          <planeGeometry args={[2, 2, 1]} />
          <meshLambertMaterial color="white" ref={useRefTrait(entity, MaterialRef)} transparent />
        </mesh>
      </group>
    </group>
  );
};
