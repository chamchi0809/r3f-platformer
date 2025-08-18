import React, {useMemo} from "react";
import {layerPxToWorldPx, pxToGridPosition} from "@/common/ldtk/utils/positionUtils.ts";
import {useTilePixelData} from "@/common/ldtk/utils/tilesetUtils.ts";
import {ConvexHullCollider, CuboidCollider} from "@react-three/rapier";
import type {BaseTileRendererProps} from "@/common/ldtk/components/layers/TilesLayerRenderer.tsx";
import {INTERACTION_GROUPS} from "@/common/constants/colGroup.ts";
import {chunk} from "es-toolkit";

export default function TileConvexCollider(
    {
        tile,
        tileset,
        texture,
        tileSize,
        layerPxDimensions,
        layerPxOffsets,
        interactionGroups = INTERACTION_GROUPS["DEFAULT"],
    }: {
        interactionGroups?: number;
    } & BaseTileRendererProps) {

    const {px, src, f, a} = tile;
    const posInPx = layerPxToWorldPx(px as [number, number], layerPxOffsets, layerPxDimensions);
    const posInGrid = pxToGridPosition(
        posInPx,
        tileSize);
    const [posX, posY] = posInGrid;

    const tileUVW = tileset.tileGridSize / tileset.pxWid;
    const tileUVH = tileset.tileGridSize / tileset.pxHei;
    const tileUVX = src[0] / tileset.pxWid;
    const tileUVY = (tileset.pxHei - src[1]) / tileset.pxHei - tileUVH;

    const cutTexture = useMemo(() => {
        const cutTexture = texture.clone();
        cutTexture.offset.set(tileUVX, tileUVY);
        cutTexture.repeat.set(tileUVW, tileUVH);
        return cutTexture;
    }, [texture, tileUVX, tileUVY, tileUVW, tileUVH]);

    const pixelData = useTilePixelData(src as [number, number], tileset);

    const vertices = useMemo(() => {
        if (!pixelData) return [];
        const chunked = chunk(pixelData, tileSize);
        const vertices: [number, number, number][] = [];
        for (let y = 0; y < tileSize; y++) {
            for (let x = 0; x < tileSize; x++) {
                const pixel = chunked[y][x];
                if (pixel[3] > 0) { // Check alpha channel
                    const worldX = (x / tileSize);
                    const worldY = (-y / tileSize);
                    vertices.push(
                        [worldX, worldY, 0.2],
                        [worldX + 1 / tileSize, worldY, 0.2],
                        [worldX + 1 / tileSize, worldY - 1 / tileSize, 0.2],
                        [worldX, worldY - 1 / tileSize, 0.2],
                        [worldX, worldY, -0.2],
                        [worldX + 1 / tileSize, worldY, -0.2],
                        [worldX + 1 / tileSize, worldY - 1 / tileSize, -0.2],
                        [worldX, worldY - 1 / tileSize, -0.2]
                    );
                }
            }
        }
        return vertices;
    }, [pixelData, tileSize]);

    if (vertices.length > 0) {
        return <ConvexHullCollider
            position={[posX, posY, 0]}
            args={[vertices.flat()]}
            collisionGroups={interactionGroups}
        />
    }

    return <CuboidCollider
        position={[posX, posY, 0]}
        args={[0.5, 0.5, 0.2]}
        collisionGroups={interactionGroups}
    />
}