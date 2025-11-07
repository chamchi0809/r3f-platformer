import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a1a;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  image-rendering: pixelated;
  font-smooth: never;
  -webkit-font-smoothing: none;
`;

const MenuBox = styled.div`
  background-color: #2a2a2a;
  padding: 40px 60px;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 400px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 40px;
  color: #ececec;
`;

const MenuButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MenuButton = styled.button`
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

interface MainMenuProps {
  onStartGame: () => void
  onShowSettings: () => void
}

function MainMenu({ onStartGame, onShowSettings }: MainMenuProps) {
  const handleExit = () => {
    window.api?.quitApp();
  };

  return (
    <Container>
      <MenuBox>
        <Title>Game Title</Title>
        <MenuButtons>
          <MenuButton onClick={onStartGame}>Game Start</MenuButton>
          <MenuButton onClick={onShowSettings}>Setting</MenuButton>
          {window.api && (
            <MenuButton onClick={handleExit}>Exit</MenuButton>
          )}
        </MenuButtons>
      </MenuBox>
    </Container>
  );
}

export default MainMenu;
