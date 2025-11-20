import type { Entity } from "koota";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait.ts";
import { ThreeRef } from "@/common/traits/ThreeRef.ts";
import { MaterialRef } from "@/common/traits/MaterialRef.ts";

export default function PlayerView({ entity }: { entity: Entity }) {
  const threeRef = useRefTrait(entity, ThreeRef);
  const materialRef = useRefTrait(entity, MaterialRef);

  return (
    <group ref={threeRef}>
      <group position-z={1}>
        <mesh>
          <planeGeometry args={[1.6, 2, 1]} />
          <meshLambertMaterial color="white" ref={materialRef} transparent />
        </mesh>
        <pointLight
          castShadow
          position-z={2}
          intensity={2}
          decay={0.5}
          distance={15}
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
          shadow-bias={0.005}
          shadow-normalBias={0.02}
        />
      </group>
    </group>
  );
};
