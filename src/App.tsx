import "@/App.css"
import {Canvas} from "@react-three/fiber";
import {CameraControls, OrthographicCamera} from "@react-three/drei";
import LdtkMap from "@/common/ldtk/components/LdtkMap.tsx";

function App() {

    return <Canvas style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        position: "absolute",
        top: 0,
        left: 0
    }}>
        <OrthographicCamera position={[0, 0, -10]}>
            <ambientLight intensity={1}/>
            <CameraControls/>
            <LdtkMap
                ldtkPath={"/assets/ldtk/test.ldtk"}
                entityRendererMap={{
                    "PlayerStart": ({entity}) => {
                        console.log(entity)
                        return <></>
                    }
                }}
            />
        </OrthographicCamera>
    </Canvas>
}

export default App