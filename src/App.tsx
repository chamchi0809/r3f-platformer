import "@/App.css"
import {Canvas} from "@react-three/fiber";
import Game from "@/Game.tsx";
import {Suspense} from "react";
import {Physics} from "@react-three/rapier";
import {KeyboardControls} from "@react-three/drei";
import {keyboardControlMap} from "@/common/defs/keyboardControlMap.ts";
import {physicsSettings} from "@/common/defs/physicsSettings.ts";
import {CAM_SIZE} from "@/common/defs/camSize.ts";
import {useMeasure} from "react-use";
import {PPU} from "@/common/defs/ppu.ts";

const RENDER_HEIGHT = PPU * CAM_SIZE * 2;

function App() {

    const [ref, {height}] = useMeasure();

    return <Canvas gl={{antialias: false, powerPreference: "high-performance"}}
                   ref={ref as any}
                   dpr={RENDER_HEIGHT / (height ?? 1)}
                   shadows={"basic"} linear={true} flat={true}
                   style={{
                       width: "100%",
                       height: "100%",
                       backgroundColor: "#000000",
                       position: "absolute",
                       top: 0,
                       left: 0,
                       imageRendering: "pixelated",
                   }}
                   resize={{scroll: false}}>
        <Suspense>
            <Physics timeStep={physicsSettings.timestep} gravity={[0, physicsSettings.gravity, 0]}>
                <KeyboardControls map={keyboardControlMap}>
                    <Game/>
                </KeyboardControls>
            </Physics>
        </Suspense>
    </Canvas>
}

export default App