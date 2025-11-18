import type { Entity } from "koota";
import { useThreeInjector } from "@/common/hooks/injection/useThreeInjector.ts";
import { useMaterialInjector } from "@/common/hooks/injection/useMaterialInjector.ts";

export default function EnemyView({ entity }: { entity: Entity }) {
  const threeRef = useThreeInjector(entity);
  const materialRef = useMaterialInjector(entity);

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
