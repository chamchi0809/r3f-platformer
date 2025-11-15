import { useQuery } from "koota/react";
import type { Entity } from "koota";
import { CharacterStartPosition } from "@/common/traits/CharacterStartPosition.ts";
import { useThreeInjector } from "@/common/hooks/injection/useThreeInjector.ts";
import { useMaterialInjector } from "@/common/hooks/injection/useMaterialInjector.ts";
import useRapier from "@/common/hooks/physics/useRapier.ts";
import useCreateCollider from "@/common/hooks/physics/useCreateCollider.ts";
import { INTERACTION_GROUPS } from "@/common/defs/colGroup.ts";
import { useInteractableInjector } from "@/common/hooks/injection/useInteractableInjector.ts";
import { IsNPC } from "@/common/traits/IsNPC.ts";
import { useUnmount } from "react-use";

const NPCView = ({ entity}: { entity: Entity }) => {
  const startPos = entity.get(CharacterStartPosition)!;

  const threeRef = useThreeInjector(entity);
  const materialRef = useMaterialInjector(entity);

  const { rapier } = useRapier();
  const sensor = useCreateCollider({
    startPosition: startPos.clone(),
    colliderDesc: rapier.ColliderDesc.cuboid(0.8, 1)
      .setCollisionGroups(INTERACTION_GROUPS.SENSOR)
      .setMass(1)
      .setRestitution(0)
      .setFriction(1)
      .setSensor(true),
  });
  useInteractableInjector(entity, sensor!);

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
