import { useQueryFirst } from "koota/react";
import { InteractableRef } from "../traits/InteractableRef";
import { IsInteractionFocused } from "../traits/IsInteractionFocused";
import type { Entity } from "koota";
import { Html } from "@react-three/drei";

function HintLabel({ entity }: { entity: Entity }) {
  // TODO: 객체 위치로 이동
  // TODO: 상호 작용 키 가져와서 표시
  return (
    <group>
      <Html>
        <div>Press Interaction Key</div>
      </Html>
    </group>
  );
}

export function InteractionHint() {
  const focused = useQueryFirst(IsInteractionFocused, InteractableRef);
  return focused && <HintLabel entity={focused} />;
}
