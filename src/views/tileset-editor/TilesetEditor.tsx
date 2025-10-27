import {useControls} from "leva";
import {Html} from "@react-three/drei";
import pathSelectPlugin from "@/common/components/leva-plugins/PathSelectPlugin.tsx";

export default function TilesetEditor() {

    const {ldtkPath} = useControls({
        ldtkPath: pathSelectPlugin({path: "", disabled: false})
    })

    return <>
        <mesh>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color={"orange"}/>
        </mesh>
        <Html>
            {ldtkPath.path}
        </Html>
    </>
}