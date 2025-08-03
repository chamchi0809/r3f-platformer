import "@/App.css"
import {Canvas} from "@react-three/fiber";
import {CameraControls, OrthographicCamera} from "@react-three/drei";
import LdtkMap from "@/common/ldtk/components/LdtkMap.tsx";
import Game from "@/Game.tsx";

function App() {

    return <Canvas style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        position: "absolute",
        top: 0,
        left: 0
    }}>
        <Game/>
    </Canvas>
}

export default App