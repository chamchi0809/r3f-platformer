import { useRefTrait } from "@/common/hooks/ecs/useRefTrait";
import { InteractionLines } from "@/common/traits/InteractionLines";
import { InteractionRef } from "@/common/traits/InteractionRef";
import { Html } from "@react-three/drei";
import type { Entity } from "koota";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ChatContainer = styled.div`
  display: inline-block;
  width: max-content;
  max-width: 500px;

  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #ccc;

  background: rgba(255, 255, 255, 0.7);

  transition-property: width, height;
  transition-timing-function: ease-in-out;
  transition-duration: 0.3s;
`;

export function InteractionChatView({ entity }: { entity: Entity }) {
  const lines = entity.get(InteractionLines) ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentIndex((prev) => {
      if (prev < lines.length - 1) return prev + 1;
      else return 0;
    }), 5000);

    return () => clearInterval(interval);
  }, [lines.length]);

  const interactionRef = useRefTrait(entity, InteractionRef);
  return (
    <group ref={interactionRef}>
      <Html center>
        <ChatContainer>
          {lines.at(currentIndex)}
        </ChatContainer>
      </Html>
    </group>
  );
}
