import React from "react";
import {layerPxToWorldPx, pxToGridPosition} from "@/common/ldtk/utils/positionUtils.ts";
import {centerTilePivot} from "@/common/ldtk/utils/tilesetUtils.ts";
import {CuboidCollider} from "@react-three/rapier";
import type {BaseTileRendererProps} from "@/common/ldtk/components/layers/TilesLayerRenderer.tsx";
import {INTERACTION_GROUPS} from "@/common/constants/colGroup.ts";

export default function TileRectCollider(
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
    // TODO: replact /tileSize with global pixel per unit (PPU) setting
    const posInPx = centerTilePivot(
        layerPxToWorldPx(px as [number, number], layerPxOffsets, layerPxDimensions),
        tileSize);
    const posInGrid = pxToGridPosition(
        posInPx,
        tileSize);
    const [posX, posY] = posInGrid;

    return <CuboidCollider position={[posX, posY, 0]} args={[.5, .5, .2]} collisionGroups={interactionGroups}/>
};