import Kbd from "@/common/components/Kbd";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait";
import { InteractionRef } from "@/common/traits/InteractionRef";
import { InteractLine } from "@/common/traits/InteractLine";
import { useApp } from "@/store/useAppStore";
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
const Line = styled.p`
  font-size: 1.2em;
`;

const KbdContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  margin: -8px;
  padding-top: 8px;

  animation: blink 4s infinite;

  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
  }
`;

export function InteractionLineView({ entity }: { entity: Entity }) {
  const { activeKeymap } = useApp();
  const interactKeys = activeKeymap.find(v => v.name === "interact")?.keys ?? [];
  const interactLine = useTrait(entity, InteractLine);

  const currentText = interactLine?.lines[interactLine.current] ?? "";
  const visibleText = currentText.slice(0, interactLine?.animIndex ?? 0);

  const interactionRef = useRefTrait(entity, InteractionRef);
  return (
    <group ref={interactionRef}>
      <Html>
        <LineContainer>
          <Line>{visibleText}</Line>
          <KbdContainer>
            ▶
            {interactKeys.map(k => (<Kbd label={k} />))}
          </KbdContainer>
        </LineContainer>
      </Html>
    </group>
  );
}
