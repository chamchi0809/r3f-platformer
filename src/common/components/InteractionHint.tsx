import { Html } from "@react-three/drei";
import type { Entity } from "koota";
import styled from "styled-components";
import { useRefTrait } from "../hooks/ecs/useRefTrait";
import { InteractionRef } from "../traits/InteractionRef";
import { useApp } from "@/store/useAppStore";

const HintContainer = styled.div`
  padding: 8px 12px;

  background: rgba(0, 0, 0, 0.7);

  color: white;
  white-space: nowrap;
`;

const Kbd = styled.kbd`
  display: inline-block;

  margin: 0 4px;
  padding: 2px 6px;
  border: 1px solid #555;
  border-radius: 3px;

  background: #222;
`;

export function InteractionHintView({ entity }: { entity: Entity }) {
  const { activeKeymap } = useApp();
  const interactKeys = activeKeymap.find(v => v.name === "interact")?.keys ?? [];

  const interactionRef = useRefTrait(entity, InteractionRef);
  return (
    <group ref={interactionRef}>
      <Html center>
        <HintContainer>
          Press
          {
            interactKeys
              .map(k => k.replace(/^Key/, ""))
              .map(k => (<Kbd key={k}>{k}</Kbd>))
          }
          to interact
        </HintContainer>
      </Html>
    </group>
  );
}
