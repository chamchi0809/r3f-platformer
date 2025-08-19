import React, {useMemo} from "react";
import {layerPxToWorldPx, pxToGridPosition} from "@/common/ldtk/utils/positionUtils.ts";
import {useTilePixelData} from "@/common/ldtk/utils/tilesetUtils.ts";
import {CuboidCollider} from "@react-three/rapier";
import type {BaseTileRendererProps} from "@/common/ldtk/components/layers/TilesLayerRenderer.tsx";
import {INTERACTION_GROUPS} from "@/common/constants/colGroup.ts";
import {chunk} from "es-toolkit";

export default function TileVoxelCollider(
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

    const pixelData = useTilePixelData(src as [number, number], tileset);

    const rects = useMemo(() => {
        if (!pixelData) return [];
        const chunked = chunk(pixelData, tileSize);
        const rects: [number, number][] = [];
        for (let y = 0; y < tileSize; y++) {
            for (let x = 0; x < tileSize; x++) {
                const pixel = chunked[y][x];
                if (pixel[3] > 0) { // Check alpha channel
                    const worldX = (x / tileSize) + 1 / tileSize / 2;
                    const worldY = (-y / tileSize) - 1 / tileSize / 2;
                    rects.push([worldX, worldY]);
                }
            }
        }
        return rects;
    }, [pixelData, tileSize])

    return <>
        {
            rects.map((rect, index) => {
                return <CuboidCollider
                    key={index}
                    position={[posX + rect[0], posY + rect[1], 0]}
                    args={[1 / tileSize / 2, 1 / tileSize / 2, 0.2]}
                    collisionGroups={interactionGroups}
                />
            })
        }
    </>
}