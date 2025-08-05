import TileSprite from "@/common/ldtk/components/tiles/TileSprite.tsx";
import React, {Fragment, type JSX} from "react";
import {useLdtkLayerContext} from "@/common/ldtk/components/layers/LayerRenderer.tsx";
import type {TileInstance, TilesetDefinition} from "@/common/ldtk/models/LdtkTypes.ts";
import * as THREE from "three";
import {useLdtkLevelContext} from "@/common/ldtk/components/LdtkMap.tsx";

export default function TilesLayerRenderer() {

    const {tileRendererMap} = useLdtkLevelContext();

    const {
        layer,
        tileset,
        texture,
        layerPxDimensions,
        layerPxOffsets,
    } = useLdtkLayerContext();

    return <>
        {tileset && texture && layer.gridTiles.map((tile, i) => {

            const enumTag = tileset.enumTags.find(tag => tag.tileIds.includes(tile.t));
            const tileRenderer = enumTag?.enumValueId
                ? tileRendererMap?.[enumTag.enumValueId]
                : undefined;
            const baseTileRendererProps: BaseTileRendererProps = {
                tile,
                tileset,
                texture,
                tileSize: layer.__gridSize,
                layerPxOffsets,
                layerPxDimensions,
            };


            return <Fragment key={i}>
                {
                    tileRenderer
                        ? tileRenderer(baseTileRendererProps)
                        : <TileSprite {...baseTileRendererProps} />
                }
            </Fragment>
        })}
    </>;
}

export interface BaseTileRendererProps {
    tile: TileInstance;
    tileset: TilesetDefinition;
    texture: THREE.Texture;
    tileSize: number;
    layerPxDimensions: [number, number];
    layerPxOffsets: [number, number];
}

export type TileRenderer = (props: BaseTileRendererProps) => JSX.Element | null;

// Tileset Enum Tag -> TileColliderRenderer
export type TileRendererMap = Record<string, TileRenderer>;