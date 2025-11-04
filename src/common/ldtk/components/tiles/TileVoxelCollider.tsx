import {useMemo} from "react";
import {layerPxToWorldPx, pxToGridPosition} from "@/common/ldtk/utils/positionUtils.ts";
import {useTilePixelData} from "@/common/ldtk/utils/tilesetUtils.ts";
import type {BaseTileRendererProps} from "@/common/ldtk/components/layers/TilesLayerRenderer.tsx";
import {INTERACTION_GROUPS} from "@/common/defs/colGroup.ts";
import {chunk} from "es-toolkit";
import useCreateCollider from "@/common/hooks/physics/useCreateCollider.ts";
import useRapier from "@/common/hooks/physics/useRapier.ts";
import {Vector2} from "three";

export default function TileVoxelCollider(
    {
        tile,
        tileset,
        tileSize,
        layerPxDimensions,
        layerPxOffsets,
        interactionGroups = INTERACTION_GROUPS["DEFAULT"],
    }: {
        interactionGroups?: number;
    } & BaseTileRendererProps) {

    const {px, src} = tile;
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

    const {rapier} = useRapier();

    useCreateCollider({
        startPosition: new Vector2(posX, posY),
        colliderDesc: rapier.ColliderDesc
            .voxels(
                new Float32Array(rects.flatMap(r => {
                    return r
                })),
                new rapier.Vector2(1 / tileSize, 1 / tileSize),
            )
            .setCollisionGroups(interactionGroups),
        enabled: rects.length > 0,
    });

    return <>
    </>
}