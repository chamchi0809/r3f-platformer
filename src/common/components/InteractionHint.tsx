import { useApp } from "@/store/useAppStore";
import { Html } from "@react-three/drei";
import type { Entity } from "koota";
import styled from "styled-components";
import { useRefTrait } from "../hooks/ecs/useRefTrait";
import { InteractionRef } from "../traits/InteractionRef";

const HintContainer = styled.div`
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  white-space: nowrap;
`;
const Kbd = styled.kbd`
  background: #222;
  border: 1px solid #555;
  border-radius: 3px;
  padding: 2px 6px;
`;

export function InteractionHintView({ entity }: { entity: Entity }) {
  const interactionRef = useRefTrait(entity, InteractionRef);

  console.log("Rendering interaction hint");

  const { activeKeymap } = useApp();
  return (
    <group ref={interactionRef}>
      <Html center>
        <HintContainer>
          Press
          {activeKeymap.find(v => v.name === "interact")?.keys.map(k => (<Kbd key={k}>{k}</Kbd>))}
          Key
        </HintContainer>
      </Html>
    </group>
  );
}
