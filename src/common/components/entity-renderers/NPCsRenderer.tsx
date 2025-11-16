import { useQuery } from "koota/react";
import type { Entity } from "koota";
import { useThreeInjector } from "@/common/hooks/injection/useThreeInjector.ts";
import { useMaterialInjector } from "@/common/hooks/injection/useMaterialInjector.ts";
import { IsNPC } from "@/common/traits/IsNPC.ts";
import { useUnmount } from "react-use";

const NPCView = ({ entity}: { entity: Entity }) => {
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

export default function NPCsRenderer() {
  const nPCs = useQuery(IsNPC);

  useUnmount(() => {
    nPCs.forEach(npc => npc.destroy());
  });

  return nPCs.map(npc => <NPCView entity={npc} />);
}
