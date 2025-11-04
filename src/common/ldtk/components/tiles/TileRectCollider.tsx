import {layerPxToWorldPx, pxToGridPosition} from "@/common/ldtk/utils/positionUtils.ts";
import {centerTilePivot} from "@/common/ldtk/utils/tilesetUtils.ts";
import type {BaseTileRendererProps} from "@/common/ldtk/components/layers/TilesLayerRenderer.tsx";
import {INTERACTION_GROUPS} from "@/common/defs/colGroup.ts";
import useCreateCollider from "@/common/hooks/physics/useCreateCollider.ts";
import {Vector2} from "three";
import useRapier from "@/common/hooks/physics/useRapier.ts";

export default function TileRectCollider(
    {
        tile,
        tileSize,
        layerPxDimensions,
        layerPxOffsets,
        interactionGroups = INTERACTION_GROUPS["DEFAULT"],
    }: {
        interactionGroups?: number;
    } & BaseTileRendererProps) {

    const {px} = tile;
    // TODO: replact /tileSize with global pixel per unit (PPU) setting
    const posInPx = centerTilePivot(
        layerPxToWorldPx(px as [number, number], layerPxOffsets, layerPxDimensions),
        tileSize);
    const posInGrid = pxToGridPosition(
        posInPx,
        tileSize);
    const [posX, posY] = posInGrid;

    const {rapier} = useRapier();

    useCreateCollider({
        startPosition: new Vector2(posX, posY),
        colliderDesc: rapier.ColliderDesc
            .cuboid(.5, .5)
            .setCollisionGroups(interactionGroups)
    })

    return <></>;
};