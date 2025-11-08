import "@/App.css";
import { Canvas } from "@react-three/fiber";
import Game from "@/views/game/Game.tsx";
import { Suspense, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { physicsSettings } from "@/common/defs/physicsSettings.ts";
import { CAM_SIZE } from "@/common/defs/camSize.ts";
import { useMeasure } from "react-use";
import { PPU } from "@/common/defs/ppu.ts";
import { Leva, useControls } from "leva";
import TilesetEditor from "@/views/tileset-editor/TilesetEditor.tsx";
import Physics from "@/common/components/Physics.tsx";
import MainMenu from "@/views/main-menu/MainMenu.tsx";
import Setting from "@/views/setting/Setting.tsx";
import { useApp } from "@/store/useAppStore.ts";
import styled from "styled-components";
import TitleBar from "@/common/components/TitleBar.tsx";
import { PauseModal } from "@/common/components/PauseModal.tsx";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  flex: 1;
  position: relative;
  background-color: #1a1a1a;
`;

const RENDER_HEIGHT = PPU * CAM_SIZE * 2;
const DEV_VIEWS = ["game", "tileset-editor"] as const;
type DevView = typeof DEV_VIEWS[number];

function App() {
  const {
    gameState,
    activeKeymap,
    startGame,
    showSettings,
    showMenu,
    goBackFromSettings,
    handleKeymapChange,
    displayMode,
    setDisplayMode,
    isPaused,
    pauseGame,
    resumeGame,
  } = useApp();

  const [ref, { height }] = useMeasure<HTMLCanvasElement>();
  const isDev = window.api?.isDev();
  const { view } = useControls({ view: { value: "game" as DevView, options: DEV_VIEWS } });
  const devView = view as DevView;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isPaused) {
          resumeGame();
        }
        else {
          pauseGame();
        }
      }
    };

    if (gameState === "play") {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState, isPaused, pauseGame, resumeGame]);

  return (
    <AppContainer>
      {displayMode === "window" && <TitleBar />}
      <ContentContainer>
        {gameState === "main" && (
          <MainMenu onStartGame={startGame} onShowSettings={showSettings} />
        )}

        {gameState === "setting" && (
          <Setting
            onShowMenu={goBackFromSettings}
            currentKeymap={activeKeymap}
            onKeymapChange={handleKeymapChange}
            setDisplayMode={setDisplayMode}
          />
        )}

        {gameState === "play" && (
          <>
            <Leva hidden={!window.electron || !isDev} />
            <Canvas
              gl={{ antialias: false, powerPreference: "high-performance" }}
              ref={ref}
              dpr={RENDER_HEIGHT / (height ?? 1)}
              shadows="basic"
              linear={true}
              flat={true}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#000000",
                position: "absolute",
                top: 0,
                left: 0,
                imageRendering: "pixelated",
              }}
              resize={{ scroll: false }}
            >
              <Suspense>
                <Physics timeStep={physicsSettings.timestep} gravity={{ x: 0, y: physicsSettings.gravity }}>
                  <KeyboardControls map={activeKeymap}>
                    {
                      devView === "game"
                        ? <Game />
                        : devView === "tileset-editor"
                          ? <TilesetEditor />
                          : null
                    }
                  </KeyboardControls>
                </Physics>
              </Suspense>
            </Canvas>
            <PauseModal />
          </>
        )}
      </ContentContainer>
    </AppContainer>
  );
}

export default App;
