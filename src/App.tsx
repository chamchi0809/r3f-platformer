import "@/App.css";
import { Canvas } from "@react-three/fiber";
import Game from "@/views/game/Game.tsx";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import { keyboardControlMap } from "@/common/defs/keyboardControlMap.ts";
import { physicsSettings } from "@/common/defs/physicsSettings.ts";
import { CAM_SIZE } from "@/common/defs/camSize.ts";
import { useMeasure } from "react-use";
import { PPU } from "@/common/defs/ppu.ts";
import { Leva, useControls } from "leva";
import TilesetEditor from "@/views/tileset-editor/TilesetEditor.tsx";
import Physics from "@/common/components/Physics.tsx";

const RENDER_HEIGHT = PPU * CAM_SIZE * 2;
const DEV_VIEWS = ["game", "tileset-editor"] as const;
type DevView = typeof DEV_VIEWS[number];

function App() {
  const [ref, { height }] = useMeasure<HTMLCanvasElement>();
  const isDev = window.api?.isDev();
  const { view } = useControls({ view: { value: "game" as DevView, options: DEV_VIEWS } });
  const devView = view as DevView;

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
            <KeyboardControls map={keyboardControlMap}>
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

export default App;
