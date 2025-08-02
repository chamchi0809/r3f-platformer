import React from "react";
import type {LayerInstance, TilesetDefinition} from "@/common/ldtk/models/LdtkTypes.ts";
import * as THREE from "three";
import TileSprite from "@/common/ldtk/components/TileSprite.tsx";

export default function LayerRenderer(
    {
        layer,
        tileset,
        texture,
        levelHeight
    }: {
        layer: LayerInstance;
        tileset?: TilesetDefinition;
        texture?: THREE.Texture;
        levelHeight: number;
    }) {
    if (layer.__type === "Tiles" || layer.__type === "AutoLayer") {
        // Render gridTiles and autoLayerTiles
        const tileArray = [
            ...(layer.gridTiles || []),
            ...(layer.autoLayerTiles || [])
        ];
        return <>
            {tileset && texture && tileArray.map((tile, i) => (
                <TileSprite
                    key={i}
                    tile={tile}
                    tileset={tileset}
                    texture={texture}
                    tileSize={layer.__gridSize}
                    levelHeight={levelHeight}
                />
            ))}
        </>;
    }
    // Entity and IntGrid layers can be handled separately
    return null;
};