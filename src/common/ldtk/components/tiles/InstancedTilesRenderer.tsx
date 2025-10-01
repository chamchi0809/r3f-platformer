import React, {useMemo} from "react";
import * as THREE from "three";
import {Instance, Instances} from "@react-three/drei";
import {pxToGridPosition} from "@/common/ldtk/utils/positionUtils.ts";
import {centerTilePivot} from "@/common/ldtk/utils/tilesetUtils.ts";
import type {TileInstance, TilesetDefinition} from "@/common/ldtk/models/LdtkTypes.ts";

interface InstancedTilesRendererProps {
    tiles: TileInstance[];
    tileset: TilesetDefinition;
    texture: THREE.Texture;
    tileSize: number;
    layerPxDimensions: [number, number];
    layerPxOffsets: [number, number];
}

export default function InstancedTilesRenderer(
    {
        tiles,
        tileset,
        texture,
        tileSize,
        layerPxDimensions,
        layerPxOffsets,
    }: InstancedTilesRendererProps) {
    // Group tiles by their texture coordinates (tileId)
    const tileGroups = useMemo(() => {
        const groups: Record<number, TileInstance[]> = {};

        tiles.forEach(tile => {
            if (!groups[tile.t]) {
                groups[tile.t] = [];
            }
            groups[tile.t].push(tile);
        });

        return groups;
    }, [tiles]);

    // Create a map of tile textures
    const tileTextures = useMemo(() => {
        const textures: Record<number, THREE.Texture> = {};

        Object.keys(tileGroups).forEach(tileId => {
            const id = parseInt(tileId);
            const tile = tileGroups[id][0];
            const {src} = tile;

            // UV mapping for tile
            const tileUVW = tileset.tileGridSize / tileset.pxWid;
            const tileUVH = tileset.tileGridSize / tileset.pxHei;
            const tileUVX = src[0] / tileset.pxWid;
            const tileUVY = (tileset.pxHei - src[1]) / tileset.pxHei - tileUVH;

            const cutTexture = texture.clone();
            cutTexture.offset.set(tileUVX, tileUVY);
            cutTexture.repeat.set(tileUVW, tileUVH);
            textures[id] = cutTexture;
        });

        return textures;
    }, [tileGroups, tileset, texture]);

    // Render each group of tiles with the same texture as a separate instanced mesh
    return <>
        {Object.entries(tileGroups).map(([tileId, groupTiles]) => {
            const id = parseInt(tileId);
            const tileTexture = tileTextures[id];

            return (
                <InstancedTileGroup
                    key={id}
                    tiles={groupTiles}
                    texture={tileTexture}
                    tileSize={tileSize}
                    layerPxDimensions={layerPxDimensions}
                    layerPxOffsets={layerPxOffsets}
                />
            );
        })}
    </>
}

interface InstancedTileGroupProps {
    tiles: TileInstance[];
    texture: THREE.Texture;
    tileSize: number;
    layerPxDimensions: [number, number];
    layerPxOffsets: [number, number];
}

function InstancedTileGroup(
    {
        tiles,
        texture,
        tileSize,
        layerPxDimensions,
        layerPxOffsets,
    }: InstancedTileGroupProps) {

    // Render transparent tiles
    const renderTiles = () => {
        if (tiles.length === 0) return null;

        return <Instances limit={tiles.length}>
            <planeGeometry args={[1, 1, 1]}/>
            <meshLambertMaterial transparent={true} color="white">
                <primitive attach="map" object={texture}/>
            </meshLambertMaterial>

            {tiles.map((tile, i) => {
                const {px, f, a} = tile;

                // Position calculation
                const posInPx = centerTilePivot(
                    [px[0] + layerPxOffsets[0], layerPxDimensions[1] - px[1] - layerPxOffsets[1]],
                    tileSize
                );
                const posInGrid = pxToGridPosition(posInPx, tileSize);

                // Flipping
                const scaleX = (f & 1) ? -1 : 1;
                const scaleY = (f & 2) ? -1 : 1;

                // For transparent tiles, we use the color's opacity
                // This is a workaround since Instance doesn't support opacity directly
                const color = new THREE.Color(1, 1, 1);

                return (
                    <Instance
                        key={i}
                        position={[posInGrid[0], posInGrid[1], 0]}
                        scale={[scaleX * 1.01, scaleY * 1.01, 1]}
                        color={color}
                    />
                );
            })}
        </Instances>
    };

    const renderLightingPillars = () => {
        return <Instances limit={tiles.length} castShadow>
            <boxGeometry args={[1, 1, 10]}/>
            <meshLambertMaterial transparent={true} opacity={0} color="white"/>
            {tiles.map((tile, i) => {
                const {px, f, a} = tile;

                // Position calculation
                const posInPx = centerTilePivot(
                    [px[0] + layerPxOffsets[0], layerPxDimensions[1] - px[1] - layerPxOffsets[1]],
                    tileSize
                );
                const posInGrid = pxToGridPosition(posInPx, tileSize);

                return <Instance
                    key={i}
                    position={[posInGrid[0], posInGrid[1], 0]}
                />
            })}
        </Instances>
    }

    return <>
        {renderTiles()}
        {renderLightingPillars()}
    </>
}