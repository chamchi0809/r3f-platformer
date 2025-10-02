import React, {useMemo} from "react";
import * as THREE from "three";
import {Instance, Instances} from "@react-three/drei";
import {layerPxToWorldPx, pxToGridPosition} from "@/common/ldtk/utils/positionUtils.ts";
import {centerTilePivot} from "@/common/ldtk/utils/tilesetUtils.ts";
import type {TileInstance, TilesetDefinition} from "@/common/ldtk/models/LdtkTypes.ts";
import tilePixelsQuery from "@/common/ldtk/queries/tilePixelsQuery.ts";
import {useLdtkLevelContext} from "@/common/ldtk/components/LdtkMap.tsx";
import {chunk, groupBy} from "es-toolkit";

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
                    tileset={tileset}
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
    tileset: TilesetDefinition;
}

function InstancedTileGroup(
    {
        tiles,
        texture,
        tileSize,
        layerPxDimensions,
        layerPxOffsets,
        tileset,
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

    const renderShadowPillars = () => {
        const {ldtkDir} = useLdtkLevelContext();

        const groupByTileId = groupBy(tiles, tile => tile.t);
        const groups = useMemo(() => Object.values(groupByTileId), [groupByTileId]);
        const {data: pixelData} = tilePixelsQuery.useAll(groups.map(g => ({
            ldtkDir,
            tileSize: tileset.tileGridSize,
            relPath: tileset.relPath ?? "",
            src: g[0].src as [number, number],
        })))

        const geometry = useMemo(() => {
            if (!pixelData) return null;

            // Build a 2D grid of all solid pixels across all tiles
            const solidPixelMap = new Map<string, boolean>();

            groups.forEach((groupTiles, groupIndex) => {
                const pixelDataForTile = pixelData[groupIndex];
                if (!pixelDataForTile) return;

                const chunked = chunk(pixelDataForTile, tileSize);

                groupTiles.forEach(t => {
                    const {px} = t;
                    const posInPx = layerPxToWorldPx(px as [number, number], layerPxOffsets, layerPxDimensions);
                    const posInGrid = pxToGridPosition(posInPx, tileSize);
                    const [posX, posY] = posInGrid;

                    for (let y = 0; y < tileSize; y++) {
                        for (let x = 0; x < tileSize; x++) {
                            const pixel = chunked[y]?.[x];
                            if (pixel && pixel[3] > 0) {
                                const worldX = posX + (x / tileSize);
                                const worldY = posY + (-y / tileSize);
                                const key = `${worldX.toFixed(6)},${worldY.toFixed(6)}`;
                                solidPixelMap.set(key, true);
                            }
                        }
                    }
                });
            });

            if (solidPixelMap.size === 0) return null;

            // Convert map to grid for easier processing
            const pixelSize = 1 / tileSize;
            const pixelPositions: [number, number][] = Array.from(solidPixelMap.keys()).map(key => {
                const [x, y] = key.split(',').map(Number);
                return [x, y];
            });

            // Greedy meshing algorithm - merge adjacent pixels into larger rectangles
            const visited = new Set<string>();
            const rectangles: { x: number, y: number, width: number, height: number }[] = [];

            // Sort by position for consistent processing
            pixelPositions.sort((a, b) => a[1] !== b[1] ? b[1] - a[1] : a[0] - b[0]);

            for (const [startX, startY] of pixelPositions) {
                const key = `${startX.toFixed(6)},${startY.toFixed(6)}`;
                if (visited.has(key)) continue;

                // Try to extend horizontally
                let width = 0;
                while (solidPixelMap.has(`${(startX + width * pixelSize).toFixed(6)},${startY.toFixed(6)}`) &&
                !visited.has(`${(startX + width * pixelSize).toFixed(6)},${startY.toFixed(6)}`)) {
                    width++;
                }

                // Try to extend vertically
                let height = 0;
                let canExtend = true;
                while (canExtend) {
                    for (let w = 0; w < width; w++) {
                        const checkKey = `${(startX + w * pixelSize).toFixed(6)},${(startY - (height + 1) * pixelSize).toFixed(6)}`;
                        if (!solidPixelMap.has(checkKey) || visited.has(checkKey)) {
                            canExtend = false;
                            break;
                        }
                    }
                    if (canExtend) height++;
                }

                // Mark all pixels in this rectangle as visited
                for (let h = 0; h <= height; h++) {
                    for (let w = 0; w < width; w++) {
                        const visitKey = `${(startX + w * pixelSize).toFixed(6)},${(startY - h * pixelSize).toFixed(6)}`;
                        visited.add(visitKey);
                    }
                }

                rectangles.push({
                    x: startX,
                    y: startY,
                    width: width * pixelSize,
                    height: (height + 1) * pixelSize
                });
            }

            // Helper function to check if a pixel coordinate is solid
            const isSolid = (x: number, y: number): boolean => {
                return solidPixelMap.has(`${x.toFixed(6)},${y.toFixed(6)}`);
            };

            // Build geometry from rectangles with only outer edge side faces
            const vertices: number[] = [];
            const indices: number[] = [];
            let vertexOffset = 0;

            rectangles.forEach(rect => {
                const {x, y, width, height} = rect;

                // Always add front and back faces
                const boxVertices = [
                    // Front face (z = 10)
                    x, y, 10,
                    x + width, y, 10,
                    x + width, y - height, 10,
                    x, y - height, 10,
                    // Back face (z = 0)
                    x, y, 0,
                    x + width, y, 0,
                    x + width, y - height, 0,
                    x, y - height, 0
                ];

                vertices.push(...boxVertices);

                const base = vertexOffset;
                const boxIndices = [];

                // Front face (z = 10, facing +z)
                boxIndices.push(base + 0, base + 2, base + 1, base + 0, base + 3, base + 2);
                // Back face (z = 0, facing -z)
                boxIndices.push(base + 4, base + 5, base + 6, base + 4, base + 6, base + 7);

                // Check each edge to see if it's on the boundary
                // Top face (facing +y) - check if there's a solid pixel above
                if (!isSolid(x, y + pixelSize)) {
                    boxIndices.push(base + 0, base + 1, base + 5, base + 0, base + 5, base + 4);
                }

                // Bottom face (facing -y) - check if there's a solid pixel below
                if (!isSolid(x, y - height - pixelSize)) {
                    boxIndices.push(base + 3, base + 6, base + 2, base + 3, base + 7, base + 6);
                }

                // Right face (facing +x) - check if there's a solid pixel to the right
                if (!isSolid(x + width, y)) {
                    boxIndices.push(base + 1, base + 2, base + 6, base + 1, base + 6, base + 5);
                }

                // Left face (facing -x) - check if there's a solid pixel to the left
                if (!isSolid(x - pixelSize, y)) {
                    boxIndices.push(base + 0, base + 7, base + 3, base + 0, base + 4, base + 7);
                }

                indices.push(...boxIndices);
                vertexOffset += 8;
            });

            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geo.setIndex(indices);
            geo.computeVertexNormals();

            return geo;
        }, [pixelData, groups, tileSize, layerPxOffsets, layerPxDimensions]);

        if (!geometry) return null;

        return <mesh geometry={geometry} castShadow>
            <meshBasicMaterial transparent opacity={0}/>
        </mesh>
    };

    return <>
        {renderTiles()}
        {renderShadowPillars()}
    </>
}