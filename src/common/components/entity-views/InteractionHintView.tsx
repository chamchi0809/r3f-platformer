import Kbd from "@/common/components/Kbd";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait";
import { InteractionRef } from "@/common/traits/InteractionRef";
import { useApp } from "@/store/useAppStore";
import { Html } from "@react-three/drei";
import type { Entity } from "koota";
import styled from "styled-components";

const HintContainer = styled.div`
  padding: 8px 12px;

  background: rgba(0, 0, 0, 0.7);

  color: white;
  white-space: nowrap;
`;

export default function InteractionHintView({ entity }: { entity: Entity }) {
  const { activeKeymap } = useApp();
  const interactKeys = activeKeymap.find(v => v.name === "interact")?.keys ?? [];

  const interactionRef = useRefTrait(entity, InteractionRef);
  return (
    <group ref={interactionRef}>
      <Html center>
        <HintContainer>
          Press
          {interactKeys.map(k => (<Kbd label={k} />))}
          to interact
        </HintContainer>
      </Html>
    </group>
  );
}
