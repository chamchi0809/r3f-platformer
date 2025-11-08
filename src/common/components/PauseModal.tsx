import styled from "styled-components";
import { useApp } from "@/store/useAppStore.ts";

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: #2a2a2a;
  padding: 40px 60px;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 20px 0;
  color: #ececec;
`;

const ModalButton = styled.button`
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #4a4a4a;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #6a6a6a;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export function PauseModal() {
  const { isPaused, resumeGame, showMenu, showSettings } = useApp();

  if (!isPaused) {
    return null;
  }

  const handleGoToMenu = () => {
    resumeGame();
    showMenu();
  };

  const handleGoToSetting = () => {
    showSettings();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Paused</Title>

        <ModalButton onClick={handleGoToMenu}>Main Menu</ModalButton>
        <ModalButton onClick={handleGoToSetting}>Setting</ModalButton>
        <ModalButton onClick={resumeGame}>Resume</ModalButton>

      </ModalContent>
    </ModalOverlay>
  );
}
