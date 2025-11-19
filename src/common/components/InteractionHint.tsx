import { useQueryFirst } from "koota/react";
import { InteractableRef } from "../traits/InteractableRef";
import { IsInteractionFocused } from "../traits/IsInteractionFocused";
import type { Entity } from "koota";
import { Html } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import styled from "styled-components";
import { useApp } from "@/store/useAppStore";
import { useFrame } from "@react-three/fiber";

const HintContainer = styled.div`
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  white-space: nowrap;
`;

function HintLabel({ entity }: { entity: Entity }) {
  const groupRef = useRef<Group>(null);
  const interactable = entity.get(InteractableRef);

  useFrame(() => {
    if (!groupRef.current) return;
    if (!interactable) return;
    const pos = groupRef.current.position;
    const targetPos = interactable.collider.translation();
    groupRef.current.position.set(targetPos.x, targetPos.y, pos.z);
  });

  const { activeKeymap } = useApp();
  return (
    <group ref={groupRef}>
      <Html>
        <HintContainer>
          Press
          {/* TODO: 키를 정규화할 방법 찾기 */}
          {/* TODO: kdb 컴포넌트 구현 */}
          {activeKeymap.find(v => v.name === "interact")?.keys}
          Key
        </HintContainer>
      </Html>
    </group>
  );
}

export function InteractionHint() {
  const focused = useQueryFirst(IsInteractionFocused, InteractableRef);
  return focused && <HintLabel entity={focused} />;
}
