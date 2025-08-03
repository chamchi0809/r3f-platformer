import "@/App.css"
import {Canvas} from "@react-three/fiber";
import Game from "@/Game.tsx";
import {Suspense} from "react";
import {Physics} from "@react-three/rapier";

function App() {

    return <Canvas style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        position: "absolute",
        top: 0,
        left: 0
    }}>
        <Suspense>
            <Physics debug>
                <Game/>
            </Physics>
        </Suspense>
    </Canvas>
}

export default App