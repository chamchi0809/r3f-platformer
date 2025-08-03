import React, {useMemo} from "react";
import * as THREE from "three";
import type {TileInstance, TilesetDefinition} from "@/common/ldtk/models/LdtkTypes.ts";
import {layerPxToWorldPx, pxToGridPosition} from "@/common/ldtk/utils/positionUtils.ts";
import {centerTilePivot} from "@/common/ldtk/utils/tilesetUtils.ts";
import {CuboidCollider} from "@react-three/rapier";

export default function TileSprite(
    {
        tile,
        tileset,
        texture,
        tileSize,
        layerPxDimensions,
        layerPxOffsets,
    }: {
        tile: TileInstance;
        tileset: TilesetDefinition;
        texture: THREE.Texture;
        tileSize: number;
        layerPxDimensions: [number, number];
        layerPxOffsets: [number, number];
    }) {
    // tile.px is [x, y] in pixels in level
    // tile.src is [x, y] in pixels in tileset
    // tile.t is the tileId in tileset
    // tile.f is flip flags
    // tile.a is alpha

    const {px, src, f, a} = tile;
    // TODO: replact /tileSize with global pixel per unit (PPU) setting
    const posInPx = centerTilePivot(
        layerPxToWorldPx(px as [number, number], layerPxOffsets, layerPxDimensions),
        tileSize);
    const posInGrid = pxToGridPosition(
        posInPx,
        tileSize);
    const [posX, posY] = posInGrid;
    const tileCols = Math.floor(tileset.pxWid / tileset.tileGridSize);

    // Flipping
    const scaleX = (f & 1) ? -1 : 1;
    const scaleY = (f & 2) ? -1 : 1;

    // UV mapping for tile
    const tileUVW = tileset.tileGridSize / tileset.pxWid;
    const tileUVH = tileset.tileGridSize / tileset.pxHei;
    const tileUVX = src[0] / tileset.pxWid;
    const tileUVY = (tileset.pxHei - src[1]) / tileset.pxHei - tileUVH;

    const cutTexture = useMemo(() => {
        const cutTexture = texture.clone();
        cutTexture.offset.set(tileUVX, tileUVY);
        cutTexture.repeat.set(tileUVW, tileUVH);
        return cutTexture;
    }, [texture])

    return <CuboidCollider position={[posX, posY, 0]} args={[.5, .5, .2]}>
        <mesh scale={[scaleX, scaleY, 1]}>
            <planeGeometry args={[1, 1, 1]}/>
            <meshLambertMaterial transparent opacity={a}>
                <primitive attach={"map"} object={cutTexture}/>
            </meshLambertMaterial>
        </mesh>
    </CuboidCollider>
};