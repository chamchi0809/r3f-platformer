import React, {useMemo} from "react";
import * as THREE from "three";
import type {TileInstance, TilesetDefinition} from "@/common/ldtk/models/LdtkTypes.ts";

export default function TileSprite(
    {
        tile,
        tileset,
        texture,
        tileSize,
        layerDimensions,
        layerPxOffsets,
    }: {
        tile: TileInstance;
        tileset: TilesetDefinition;
        texture: THREE.Texture;
        tileSize: number;
        layerDimensions: [number, number];
        layerPxOffsets: [number, number];
    }) {
    // tile.px is [x, y] in pixels in level
    // tile.src is [x, y] in pixels in tileset
    // tile.t is the tileId in tileset
    // tile.f is flip flags
    // tile.a is alpha

    // Compute UVs for this tile
    const {px, src, f, a} = tile;
    // TODO: replact /tileSize with global pixel per unit (PPU) setting
    const posX = (px[0] + layerPxOffsets[0] + tileSize / 2) / tileSize;
    const posY = (layerDimensions[1] * tileSize - px[1] - layerPxOffsets[1] - tileSize / 2) / tileSize;
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

    return <mesh position={[posX, posY, 0]} scale={[scaleX, scaleY, 1]}>
        <planeGeometry args={[1, 1, 1]}/>
        <meshLambertMaterial transparent opacity={a}>
            <primitive attach={"map"} object={cutTexture}/>
        </meshLambertMaterial>
    </mesh>
};