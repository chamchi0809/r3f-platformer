import LdtkMap from "@/common/ldtk/components/LdtkMap.tsx";
import {layerPxToWorldPx, pxToGridPosition} from "@/common/ldtk/utils/positionUtils.ts";
import {centerTilePivot} from "@/common/ldtk/utils/tilesetUtils.ts";
import {RigidBody} from "@react-three/rapier";
import TileSprite from "@/common/ldtk/components/tiles/TileSprite.tsx";
import TileRectCollider from "@/common/ldtk/components/tiles/TileRectCollider.tsx";
import CameraRenderer from "@/common/components/CameraRenderer.tsx";
import TileConvexCollider from "@/common/ldtk/components/tiles/TileConvexCollider.tsx";
import {INTERACTION_GROUPS} from "@/common/constants/colGroup.ts";
import TileVoxelCollider from "@/common/ldtk/components/tiles/TileVoxelCollider.tsx";
import Startup from "@/Startup.tsx";

export default function Game() {

    return <>
        <Startup/>
        <ambientLight intensity={1}/>
        <CameraRenderer/>
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
            tileRendererMap={{
                "RECT": (props) => {
                    return <>
                        <TileSprite {...props}/>
                        <TileRectCollider {...props}/>
                    </>
                },
                "RECT_GREY": (props) => {
                    return <>
                        <TileSprite {...props}/>
                        <TileRectCollider {...props} interactionGroups={INTERACTION_GROUPS.DEFAULT}/>
                    </>
                },
                "SPIKE_GREY": (props) => {
                    return <>
                        <TileSprite {...props}/>
                        <TileVoxelCollider {...props} interactionGroups={INTERACTION_GROUPS.DEFAULT}/>
                    </>
                },
                "SPIKE_WHITE": (props) => {
                    return <>
                        <TileSprite {...props}/>
                        <TileConvexCollider {...props} interactionGroups={INTERACTION_GROUPS.WHITE} />
                    </>
                }
            }}
        />
    </>
}