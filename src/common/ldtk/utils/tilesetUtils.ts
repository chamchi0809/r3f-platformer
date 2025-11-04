import * as THREE from 'three'
import { TextureLoader } from 'three'
import type { TilesetDefinition } from '@/common/ldtk/models/LdtkTypes.ts'
import { useLdtkLevelContext } from '@/common/ldtk/components/LdtkMap.tsx'
import { chunk } from 'es-toolkit'
import tilesetImageQuery from '@/common/ldtk/queries/tilesetImageQuery.ts'
import { getSafePath } from '@/common/utils/electronUtils.ts'

export const getTilesetByUid = (tilesets: TilesetDefinition[], uid: number): TilesetDefinition | undefined => {
  return tilesets.find(ts => ts.uid === uid)
}

const textureCache: Record<string, THREE.Texture> = {}

export const getTilesetTexture = (publicPath: string): THREE.Texture => {
  const safePath = getSafePath(publicPath)
  if (!textureCache[safePath]) {
    textureCache[safePath] = new TextureLoader().load(safePath)
    textureCache[safePath].magFilter = THREE.NearestFilter
    textureCache[safePath].minFilter = THREE.NearestFilter
  }
  return textureCache[safePath]
}

export const centerTilePivot = (px: [number, number], tileSize: number): [number, number] => {
  return [
    px[0] + tileSize / 2,
    px[1] - tileSize / 2,
  ]
}

export const useTilePixelData = (src: [number, number], tileset: TilesetDefinition) => {
  const tileSize = tileset.tileGridSize
  const { ldtkDir } = useLdtkLevelContext()
  const { data: image } = tilesetImageQuery.use({
    ldtkDir,
    relPath: tileset.relPath ?? '',
  })
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx && image) {
    ctx.drawImage(image, 0, 0)
    return chunk(Array.from(ctx.getImageData(src[0], src[1], tileSize, tileSize).data), 4)
  }
  return undefined
}

export const useTilesetPixelData = (tileset: TilesetDefinition) => {
  const { ldtkDir } = useLdtkLevelContext()
  const { data: image } = tilesetImageQuery.use({
    ldtkDir,
    relPath: tileset.relPath ?? '',
  })
  const tileSize = tileset.tileGridSize
  const cols = Math.floor(tileset.pxWid / tileSize)
  const rows = Math.floor(tileset.pxHei / tileSize)
  const pixels: Record<number, number[][]> = {}
  if (image) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(image, 0, 0)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const tileId = y * cols + x
          pixels[tileId] = chunk(Array.from(ctx.getImageData(x * tileSize, y * tileSize, tileSize, tileSize).data), 4)
        }
      }
    }
  }
  return pixels
}
