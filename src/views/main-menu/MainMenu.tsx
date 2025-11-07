import "@/views/main-menu/MainMenu.css";

interface MainMenuProps {
  onStartGame: () => void
  onShowSettings: () => void
}

function MainMenu({ onStartGame, onShowSettings }: MainMenuProps) {
  const handleExit = () => {
    window.api?.quitApp();
  };

  return (
    <div className="main-menu-container">
      <div className="menu-box">
        <h1 className="game-title">Game Title</h1>
        <div className="menu-buttons">
          <button onClick={onStartGame}>Game Start</button>
          <button onClick={onShowSettings}>Setting</button>
          {window.api && (
            <button onClick={handleExit}>Exit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
