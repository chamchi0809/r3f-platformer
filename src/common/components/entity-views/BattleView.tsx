import type { Entity } from "koota";
import { Html } from "@react-three/drei";
import { useRefTrait } from "@/common/hooks/ecs/useRefTrait";
import { BattleViewRef } from "@/common/traits/BattleViewRef";
import styled from "styled-components";
import { pressedRunawayInput } from "@/common/systems/pressed/pressedRunawayInput";
import { useWorld } from "koota/react";
import { useCallback } from "react";
import { HealthSystem } from "@/common/systems/health";

const StyledRootContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  width: 100%;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  width: 100%;
  height: 30%;
  padding: 5% 0;
  gap: 5%;
  justify-content: center;
  box-sizing: border-box;
`;

const StyledButton = styled.button`
  display: flex;
  width: 15%;
  font-size: 2vw;
  align-items: center;
  justify-content: center;
`;

export default function BattleView({ entity }: { entity: Entity }) {
  const battleViewRef = useRefTrait(entity, BattleViewRef);
  const world = useWorld();

  const handleRunaway = useCallback(() => {
    pressedRunawayInput(world);
  }, [world]);

  const handleAttack = useCallback(() => {
    HealthSystem.from(world).damage(10);
  }, [world]);

  return (
    <group ref={battleViewRef}>
      <Html fullscreen>
        <StyledRootContainer>
          <StyledButtonContainer>
            <StyledButton onClick={handleAttack}>Attack</StyledButton>
            <StyledButton onClick={handleRunaway}>Runaway</StyledButton>
          </StyledButtonContainer>
        </StyledRootContainer>
      </Html>
    </group>
  );
}
