import LdtkMap from "@/common/ldtk/components/LdtkMap.tsx";
import TileSprite from "@/common/ldtk/components/tiles/TileSprite.tsx";
import TileRectCollider from "@/common/ldtk/components/tiles/TileRectCollider.tsx";
import CameraRenderer from "@/common/components/CameraRenderer.tsx";
import TileConvexCollider from "@/common/ldtk/components/tiles/TileConvexCollider.tsx";
import {INTERACTION_GROUPS} from "@/common/defs/colGroup.ts";
import TileVoxelCollider from "@/common/ldtk/components/tiles/TileVoxelCollider.tsx";
import Startup from "@/Startup.tsx";
import FrameLoop from "@/FrameLoop.tsx";
import PlayerSpawner from "@/common/components/PlayerSpawner.tsx";
import PlayerRenderer from "@/common/components/PlayerRenderer.tsx";

export default function Game() {

    return <>
        <Startup/>
        <FrameLoop/>
        <ambientLight intensity={1}/>
        <CameraRenderer/>
        <PlayerRenderer/>
        <LdtkMap
            ldtkPath={"/assets/ldtk/test.ldtk"}
            entityRendererMap={{
                "PlayerStart": PlayerSpawner
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