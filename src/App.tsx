import "@/App.css"
import {Canvas} from "@react-three/fiber";
import Game from "@/Game.tsx";
import {Suspense} from "react";
import {Physics} from "@react-three/rapier";
import {KeyboardControls} from "@react-three/drei";
import {keyboardControlMap} from "@/common/defs/keyboardControlMap.ts";
import {physicsSettings} from "@/common/defs/physicsSettings.ts";

function App() {

    return <Canvas shadows linear={true} style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        position: "absolute",
        top: 0,
        left: 0
    }}>
        <Suspense>
            <Physics debug timeStep={physicsSettings.timestep} gravity={[0, physicsSettings.gravity, 0]}>
                <KeyboardControls map={keyboardControlMap}>
                    <Game/>
                </KeyboardControls>
            </Physics>
        </Suspense>
    </Canvas>
}

export default App