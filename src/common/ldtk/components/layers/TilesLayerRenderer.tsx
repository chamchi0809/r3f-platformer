import TileSprite from "@/common/ldtk/components/tiles/TileSprite.tsx";
import React from "react";
import {useLdtkLayerContext} from "@/common/ldtk/components/layers/LayerRenderer.tsx";

export default function TilesLayerRenderer() {

    const {
        layer,
        tileset,
        texture,
        layerDimensions,
        layerPxOffsets,
    } = useLdtkLayerContext();
    return <>
        {tileset && texture && layer.gridTiles.map((tile, i) => (
            <TileSprite
                key={i}
                tile={tile}
                tileset={tileset}
                texture={texture}
                tileSize={layer.__gridSize}
                layerPxOffsets={layerPxOffsets}
                layerDimensions={layerDimensions}
            />
        ))}
    </>;
}