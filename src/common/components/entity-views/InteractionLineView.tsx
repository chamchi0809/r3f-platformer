import { useRefTrait } from "@/common/hooks/ecs/useRefTrait";
import { InteractionRef } from "@/common/traits/InteractionRef";
import { InteractLine } from "@/common/traits/InteractLine";
import { Html } from "@react-three/drei";
import type { Entity } from "koota";
import { useTrait } from "koota/react";
import styled from "styled-components";

const LineContainer = styled.div`
  display: inline-block;
  width: max-content;
  max-width: 30vw;

  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #ccc;

  background: rgba(255, 255, 255, 0.7);

  line-height: 1.4;
`;

export function InteractionLineView({ entity }: { entity: Entity }) {
  const interactLine = useTrait(entity, InteractLine);

  const currentText = interactLine?.lines[interactLine.current] ?? "";
  const visibleText = currentText.slice(0, interactLine?.animIndex ?? 0);

  const interactionRef = useRefTrait(entity, InteractionRef);
  return (
    <group ref={interactionRef}>
      <Html>
        <LineContainer>
          {visibleText}
        </LineContainer>
      </Html>
    </group>
  );
}
