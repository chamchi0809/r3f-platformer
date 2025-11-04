import { useMemo } from 'react'
import * as THREE from 'three'
import { Instance, Instances } from '@react-three/drei'
import { layerPxToWorldPx, pxToGridPosition } from '@/common/ldtk/utils/positionUtils.ts'
import { centerTilePivot } from '@/common/ldtk/utils/tilesetUtils.ts'
import type { TileInstance, TilesetDefinition } from '@/common/ldtk/models/LdtkTypes.ts'
import tilePixelsQuery from '@/common/ldtk/queries/tilePixelsQuery.ts'
import { useLdtkLevelContext } from '@/common/ldtk/components/LdtkMap.tsx'
import { chunk, groupBy } from 'es-toolkit'

interface InstancedTilesRendererProps {
  tiles: TileInstance[]
  tileset: TilesetDefinition
  texture: THREE.Texture
  tileSize: number
  layerPxDimensions: [number, number]
  layerPxOffsets: [number, number]
}

const SHADOW_PILLAR_MAT = new THREE.MeshBasicMaterial({ color: 'white', transparent: true, opacity: 0 })

export default function InstancedTilesRenderer(
  {
    tiles,
    tileset,
    texture,
    tileSize,
    layerPxDimensions,
    layerPxOffsets,
  }: InstancedTilesRendererProps) {
  // Configure texture to prevent seams
  useMemo(() => {
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
  }, [texture])

  // Group tiles by their texture coordinates (tileId)
  const tileGroups = useMemo(() => {
    const groups: Record<number, TileInstance[]> = {}

    tiles.forEach((tile) => {
      if (!groups[tile.t]) {
        groups[tile.t] = []
      }
      groups[tile.t].push(tile)
    })

    return groups
  }, [tiles])

  // Create a map of tile textures
  const tileTextures = useMemo(() => {
    const textures: Record<number, THREE.Texture> = {}

    Object.keys(tileGroups).forEach((tileId) => {
      const id = parseInt(tileId)
      const tile = tileGroups[id][0]
      const { src } = tile

      // UV mapping for tile with inset to prevent bleeding
      const insetPixels = 0.1
      const tileUVW = (tileset.tileGridSize - insetPixels * 2) / tileset.pxWid
      const tileUVH = (tileset.tileGridSize - insetPixels * 2) / tileset.pxHei
      const tileUVX = (src[0] + insetPixels) / tileset.pxWid
      const tileUVY = (tileset.pxHei - src[1] - insetPixels) / tileset.pxHei - tileUVH

      const cutTexture = texture.clone()
      cutTexture.offset.set(tileUVX, tileUVY)
      cutTexture.repeat.set(tileUVW, tileUVH)
      textures[id] = cutTexture
    })

    return textures
  }, [tileGroups, tileset, texture])

  // Render each group of tiles with the same texture as a separate instanced mesh
  return (
    <>
      {Object.entries(tileGroups).map(([tileId, groupTiles]) => {
        const id = parseInt(tileId)
        const tileTexture = tileTextures[id]

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
        )
      })}
    </>
  )
}

interface InstancedTileGroupProps {
  tiles: TileInstance[]
  texture: THREE.Texture
  tileSize: number
  layerPxDimensions: [number, number]
  layerPxOffsets: [number, number]
  tileset: TilesetDefinition
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
    if (tiles.length === 0) return null

    return (
      <Instances limit={tiles.length}>
        <planeGeometry args={[1, 1, 1]} />
        <meshLambertMaterial transparent={true} color="white">
          <primitive attach="map" object={texture} />
        </meshLambertMaterial>

        {tiles.map((tile, i) => {
          const { px, f } = tile

          // Position calculation
          const posInPx = centerTilePivot(
            [px[0] + layerPxOffsets[0], layerPxDimensions[1] - px[1] - layerPxOffsets[1]],
            tileSize,
          )
          const posInGrid = pxToGridPosition(posInPx, tileSize)

          // Flipping
          const scaleX = (f & 1) ? -1 : 1
          const scaleY = (f & 2) ? -1 : 1

          // For transparent tiles, we use the color's opacity
          // This is a workaround since Instance doesn't support opacity directly
          const color = new THREE.Color(1, 1, 1)

          return (
            <Instance
              key={i}
              position={[posInGrid[0], posInGrid[1], 0]}
              scale={[scaleX, scaleY, 1]}
              color={color}
            />
          )
        })}
      </Instances>
    )
  }

  const renderShadowPillars = () => {
    const { ldtkDir } = useLdtkLevelContext()

    const groupByTileId = groupBy(tiles, tile => tile.t)
    const groups = Object.values(groupByTileId)

    const { data: pixelData } = tilePixelsQuery.useSuspenseAll(groups.map(g => ({
      ldtkDir,
      tileSize: tileset.tileGridSize,
      relPath: tileset.relPath ?? '',
      src: g[0].src as [number, number],
    })))

    const geometry = useMemo(() => {
      // if (!pixelData) return null;

      // Use integer grid coordinates to avoid floating point issues
      const PRECISION = 1000000 // 6 decimal places
      const solidPixelSet = new Set<number>()

      // Helper to encode 2D coordinates into a single integer
      const encode = (x: number, y: number) => {
        const ix = Math.round(x * PRECISION)
        const iy = Math.round(y * PRECISION)
        // Encode as single number (assuming reasonable world bounds)
        return ix * 100000000 + (iy + 50000000) // offset y to handle negatives
      }

      const decode = (key: number): [number, number] => {
        const iy = (key % 100000000) - 50000000
        const ix = Math.floor(key / 100000000)
        return [ix / PRECISION, iy / PRECISION]
      }

      // Build solid pixel set with integer keys
      let minX = Infinity, maxX = -Infinity
      let minY = Infinity, maxY = -Infinity

      groups.forEach((groupTiles, groupIndex) => {
        const pixelDataForTile = pixelData[groupIndex]
        if (!pixelDataForTile) return

        const chunked = chunk(pixelDataForTile, tileSize)

        groupTiles.forEach((t) => {
          const { px } = t
          const posInPx = layerPxToWorldPx(px as [number, number], layerPxOffsets, layerPxDimensions)
          const posInGrid = pxToGridPosition(posInPx, tileSize)
          const [posX, posY] = posInGrid

          for (let y = 0; y < tileSize; y++) {
            for (let x = 0; x < tileSize; x++) {
              const pixel = chunked[y]?.[x]
              if (pixel && pixel[3] > 0) {
                const worldX = posX + (x / tileSize)
                const worldY = posY + (-y / tileSize)

                solidPixelSet.add(encode(worldX, worldY))

                minX = Math.min(minX, worldX)
                maxX = Math.max(maxX, worldX)
                minY = Math.min(minY, worldY)
                maxY = Math.max(maxY, worldY)
              }
            }
          }
        })
      })

      if (solidPixelSet.size === 0) return null

      // Convert Set to sorted array for greedy meshing
      const pixelArray = Array.from(solidPixelSet).map(decode)
      pixelArray.sort((a, b) => a[1] !== b[1] ? b[1] - a[1] : a[0] - b[0])

      // Greedy meshing with integer grid
      const visited = new Set<number>()
      const rectangles: { x: number, y: number, width: number, height: number }[] = []
      const pixelSize = 1 / tileSize

      for (const [startX, startY] of pixelArray) {
        const key = encode(startX, startY)
        if (visited.has(key)) continue

        // Extend horizontally
        let width = 0
        while (true) {
          const checkX = startX + width * pixelSize
          const checkKey = encode(checkX, startY)
          if (!solidPixelSet.has(checkKey) || visited.has(checkKey)) break
          width++
        }

        // Extend vertically
        let height = 0
        outer: while (true) {
          for (let w = 0; w < width; w++) {
            const checkX = startX + w * pixelSize
            const checkY = startY - (height + 1) * pixelSize
            const checkKey = encode(checkX, checkY)
            if (!solidPixelSet.has(checkKey) || visited.has(checkKey)) {
              break outer
            }
          }
          height++
        }

        // Mark visited
        for (let h = 0; h <= height; h++) {
          for (let w = 0; w < width; w++) {
            const visitX = startX + w * pixelSize
            const visitY = startY - h * pixelSize
            visited.add(encode(visitX, visitY))
          }
        }

        rectangles.push({
          x: startX,
          y: startY,
          width: width * pixelSize,
          height: (height + 1) * pixelSize,
        })
      }

      // Pre-allocate arrays with known size
      const verticesPerRect = 24 // 8 vertices * 3 coords
      const indicesPerRect = 36 // 6 faces * 2 triangles * 3 vertices
      const vertices = new Float32Array(rectangles.length * verticesPerRect)
      const indices = new Uint32Array(rectangles.length * indicesPerRect)

      let vOffset = 0
      let iOffset = 0
      let vertexOffset = 0

      rectangles.forEach((rect) => {
        const { x, y, width, height } = rect

        // Front face (z = 1)
        vertices[vOffset++] = x
        vertices[vOffset++] = y
        vertices[vOffset++] = 1

        vertices[vOffset++] = x + width
        vertices[vOffset++] = y
        vertices[vOffset++] = 1

        vertices[vOffset++] = x + width
        vertices[vOffset++] = y - height
        vertices[vOffset++] = 1

        vertices[vOffset++] = x
        vertices[vOffset++] = y - height
        vertices[vOffset++] = 1

        // Back face (z = 0)
        vertices[vOffset++] = x
        vertices[vOffset++] = y
        vertices[vOffset++] = 0

        vertices[vOffset++] = x + width
        vertices[vOffset++] = y
        vertices[vOffset++] = 0

        vertices[vOffset++] = x + width
        vertices[vOffset++] = y - height
        vertices[vOffset++] = 0

        vertices[vOffset++] = x
        vertices[vOffset++] = y - height
        vertices[vOffset++] = 0

        const base = vertexOffset

        // Front face
        indices[iOffset++] = base + 0
        indices[iOffset++] = base + 2
        indices[iOffset++] = base + 1
        indices[iOffset++] = base + 0
        indices[iOffset++] = base + 3
        indices[iOffset++] = base + 2
        // Back face
        indices[iOffset++] = base + 4
        indices[iOffset++] = base + 5
        indices[iOffset++] = base + 6
        indices[iOffset++] = base + 4
        indices[iOffset++] = base + 6
        indices[iOffset++] = base + 7
        // Top face
        indices[iOffset++] = base + 0
        indices[iOffset++] = base + 1
        indices[iOffset++] = base + 5
        indices[iOffset++] = base + 0
        indices[iOffset++] = base + 5
        indices[iOffset++] = base + 4
        // Bottom face
        indices[iOffset++] = base + 3
        indices[iOffset++] = base + 6
        indices[iOffset++] = base + 2
        indices[iOffset++] = base + 3
        indices[iOffset++] = base + 7
        indices[iOffset++] = base + 6
        // Right face
        indices[iOffset++] = base + 1
        indices[iOffset++] = base + 2
        indices[iOffset++] = base + 6
        indices[iOffset++] = base + 1
        indices[iOffset++] = base + 6
        indices[iOffset++] = base + 5
        // Left face
        indices[iOffset++] = base + 0
        indices[iOffset++] = base + 7
        indices[iOffset++] = base + 3
        indices[iOffset++] = base + 0
        indices[iOffset++] = base + 4
        indices[iOffset++] = base + 7

        vertexOffset += 8
      })

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      geo.setIndex(new THREE.BufferAttribute(indices, 1))
      geo.computeVertexNormals() // Add normals for better shadow quality

      return geo
    }, [pixelData, groups, tileSize, layerPxOffsets, layerPxDimensions])

    if (!geometry) return null

    return (
      <mesh geometry={geometry} material={SHADOW_PILLAR_MAT} castShadow scale-z={10} position-z={-5}>
      </mesh>
    )
  }

  return (
    <>
      {renderTiles()}
      {renderShadowPillars()}
    </>
  )
}
