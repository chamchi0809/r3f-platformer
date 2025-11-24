import "@/App.css";
import { Loader } from "@/common/components/Loader.tsx";
import { PauseModal } from "@/common/components/PauseModal.tsx";
import Physics from "@/common/components/Physics.tsx";
import TitleBar from "@/common/components/TitleBar.tsx";
import { CAM_SIZE } from "@/common/defs/camSize.ts";
import { physicsSettings } from "@/common/defs/physicsSettings.ts";
import { PPU } from "@/common/defs/ppu.ts";
import { useApp } from "@/store/useAppStore.ts";
import Game from "@/views/game/Game.tsx";
import MainMenu from "@/views/main-menu/MainMenu.tsx";
import Setting from "@/views/setting/Setting.tsx";
import TilesetEditor from "@/views/tileset-editor/TilesetEditor.tsx";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { Suspense } from "react";
import { useKeyPressEvent, useMeasure } from "react-use";
import styled from "styled-components";

const RENDER_HEIGHT = PPU * CAM_SIZE * 2;
const DEV_VIEWS = ["game", "tileset-editor"] as const;
type DevView = typeof DEV_VIEWS[number];

function App() {
  const {
    gameState,
    activeKeymap,
    displayMode,
    isPaused,
    pauseGame,
    resumeGame,
    previousGameState,
  } = useApp();

  const [ref, { height }] = useMeasure<HTMLCanvasElement>();
  const isDev = window.api?.isDev();
  const { view } = useControls({ view: { value: "game" as DevView, options: DEV_VIEWS } });
  const devView = view as DevView;

  useKeyPressEvent("Escape", () => {
    if (gameState === "play") {
      if (isPaused) {
        resumeGame();
      }
      else {
        pauseGame();
      }
    }
  });

  return (
    <AppContainer>
      {(displayMode !== "fullscreen" && displayMode !== "borderless") && <TitleBar />}
      <ContentContainer>
        {(gameState === "main" || gameState === "setting") && (
          <UiContainer visible={true}>
            {gameState === "main" && <MainMenu />}
            {gameState === "setting" && <Setting />}
          </UiContainer>
        )}

        {(gameState === "play" || (gameState === "setting" && previousGameState === "play")) && (
          <GameContainer visible={gameState === "play"}>
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
              <Suspense fallback={<Loader />}>
                <Physics
                  timeStep={physicsSettings.timestep}
                  gravity={{ x: 0, y: physicsSettings.gravity }}
                  debug={isDev}
                >
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
          </GameContainer>
        )}
      </ContentContainer>
    </AppContainer>
  );
}

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

const UiContainer = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: ${props => (props.visible ? "visible" : "hidden")};
  pointer-events: ${props => (props.visible ? "auto" : "none")};
  z-index: 10;
`;

const GameContainer = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: ${props => (props.visible ? "visible" : "hidden")};
  pointer-events: ${props => (props.visible ? "auto" : "none")};
  z-index: 1;
`;

export default App;
