import {CameraControls, OrthographicCamera} from "@react-three/drei";
import LdtkMap from "@/common/ldtk/components/LdtkMap.tsx";
import {layerPxToWorldPx, pxToGridPosition} from "@/common/ldtk/utils/positionUtils.ts";
import {centerTilePivot} from "@/common/ldtk/utils/tilesetUtils.ts";
import {RigidBody} from "@react-three/rapier";

export default function Game() {


    return <>
        <ambientLight intensity={1}/>
        <OrthographicCamera position={[0, 0, -10]}>
            <CameraControls/>
            <LdtkMap
                ldtkPath={"/assets/ldtk/test.ldtk"}
                entityRendererMap={{
                    "PlayerStart": ({entity, layer, layerPxOffsets, layerPxDimensions}) => {
                        const worldPx = centerTilePivot(layerPxToWorldPx(entity.px as [number, number], layerPxOffsets, layerPxDimensions), layer.__gridSize);
                        const worldPos = pxToGridPosition(worldPx, layer.__gridSize);

                        return <RigidBody colliders={"hull"} position={[worldPos[0], worldPos[1], 0]}>
                            <mesh>
                                <boxGeometry args={[1, 1, 1]}/>
                                <meshStandardMaterial color={"#00ff00"}/>
                            </mesh>
                        </RigidBody>
                    }
                }}
            />
        </OrthographicCamera>
    </>
}