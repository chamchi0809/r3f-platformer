import "@/App.css"
import {Canvas} from "@react-three/fiber";
import Game from "@/views/Game.tsx";
import {Suspense} from "react";
import {Physics} from "@react-three/rapier";
import {KeyboardControls} from "@react-three/drei";
import {keyboardControlMap} from "@/common/defs/keyboardControlMap.ts";
import {physicsSettings} from "@/common/defs/physicsSettings.ts";
import {CAM_SIZE} from "@/common/defs/camSize.ts";
import {useMeasure} from "react-use";
import {PPU} from "@/common/defs/ppu.ts";
import {Leva, useControls} from "leva";

const RENDER_HEIGHT = PPU * CAM_SIZE * 2;
const DEV_VIEWS = ["game", "meta_editor"];
type DevView = typeof DEV_VIEWS[number];

function App() {

    const [ref, {height}] = useMeasure();
    const isDev = window.api?.isDev();
    const {view} = useControls({view: {value: "game" as DevView, options: DEV_VIEWS}});

    return <>
        <Leva

            hidden={!window.electron || !isDev}
        />
        <Canvas gl={{antialias: false, powerPreference: "high-performance"}}
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
                        {
                            view === "game"
                                ? <Game/>
                                : view === "meta_editor"
                                    ? <></>
                                    : null
                        }
                    </KeyboardControls>
                </Physics>
            </Suspense>
        </Canvas>
    </>
}

export default App