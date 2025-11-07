import "@/App.css";
import { Canvas } from "@react-three/fiber";
import Game from "@/views/game/Game.tsx";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls, type KeyboardControlsEntry } from "@react-three/drei";
import { keyboardControlMap, type KeyboardControlType } from "@/common/defs/keyboardControlMap.ts";
import { physicsSettings } from "@/common/defs/physicsSettings.ts";
import { CAM_SIZE } from "@/common/defs/camSize.ts";
import { useMeasure } from "react-use";
import { PPU } from "@/common/defs/ppu.ts";
import { Leva, useControls } from "leva";
import TilesetEditor from "@/views/tileset-editor/TilesetEditor.tsx";
import Physics from "@/common/components/Physics.tsx";
import MainMenu from "@/views/main-menu/MainMenu.tsx";
import Setting from "@/views/setting/Setting.tsx";

const RENDER_HEIGHT = PPU * CAM_SIZE * 2;
const DEV_VIEWS = ["game", "tileset-editor"] as const;
type DevView = typeof DEV_VIEWS[number];
type GameState = "main" | "play" | "setting";
type KeymapEntry = KeyboardControlsEntry<KeyboardControlType>;

function App() {
  const [ref, { height }] = useMeasure<HTMLCanvasElement>();
  const isDev = window.api?.isDev();
  const { view } = useControls({ view: { value: "game" as DevView, options: DEV_VIEWS } });
  const devView = view as DevView;
  const [gameState, setGameState] = useState<GameState>("main");
  const [activeKeymap, setActiveKeymap] = useState<KeymapEntry[]>(keyboardControlMap);

  useEffect(() => {
    async function loadKeymap() {
      if (!window.api) {
        return;
      }
      try {
        const result = await window.api.readUserData("keymap.json");
        if (result.data) {
          const savedMap = JSON.parse(result.data) as KeymapEntry[];
          if (Array.isArray(savedMap) && savedMap.length === keyboardControlMap.length) {
            setActiveKeymap(savedMap);
          }
        }
      }
      catch {
        console.log("No custom keymap found, using defaults.");
      }
    }
    loadKeymap();
  }, []);

  const handleKeymapChange = (newMap: KeymapEntry[]) => {
    setActiveKeymap(newMap);
    window.api?.writeUserData("keymap.json", JSON.stringify(newMap))
      .catch(err => console.error("Failed to save keymap:", err));
  };

  const startGame = () => setGameState("play");
  const showSettings = () => setGameState("setting");
  const showMenu = () => setGameState("main");

  if (gameState === "main") {
    return <MainMenu onStartGame={startGame} onShowSettings={showSettings} />;
  }

  if (gameState === "setting") {
    return (
      <Setting
        onShowMenu={showMenu}
        currentKeymap={activeKeymap}
        onKeymapChange={handleKeymapChange}
      >
      </Setting>
    );
  }

  if (gameState === "play") {
    return (
      <>
        <Leva
          hidden={!window.electron || !isDev}
        />
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
      </>
    );
  }
}

export default App;
