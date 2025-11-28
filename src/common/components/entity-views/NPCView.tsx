import type { Entity } from "koota";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait.ts";
import { RootRef } from "@/common/traits/RootRef.ts";
import { MaterialRef } from "@/common/traits/MaterialRef.ts";
import { MeshRef } from "@/common/traits/MeshRef.ts";

export default function NPCView({ entity }: { entity: Entity }) {
  return (
    <group ref={useRefTrait(entity, RootRef)}>
      <group position-z={1}>
        <mesh ref={useRefTrait(entity, MeshRef)}>
          <planeGeometry args={[2, 2, 1]} />
          <meshLambertMaterial color="white" ref={useRefTrait(entity, MaterialRef)} transparent />
        </mesh>
      </group>
    </group>
  );
};
