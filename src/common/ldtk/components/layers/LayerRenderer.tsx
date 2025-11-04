import { createContext, useContext, useMemo } from "react"
import type { LayerInstance, TilesetDefinition } from "@/common/ldtk/models/LdtkTypes.ts"
import TilesLayerRenderer from "@/common/ldtk/components/layers/TilesLayerRenderer.tsx"
import { getTilesetByUid, getTilesetTexture } from "@/common/ldtk/utils/tilesetUtils.ts"
import { useLdtkLevelContext } from "@/common/ldtk/components/LdtkMap.tsx"
import EntitiesLayerRenderer from "@/common/ldtk/components/layers/EntitiesLayerRenderer.tsx"
import * as THREE from "three"
import IntGridLayerRenderer from "@/common/ldtk/components/layers/IntGridLayerRenderer.tsx"

export default function LayerRenderer(
  {
    layer,
  }: {
    layer: LayerInstance
  }) {
  const { ldtk, ldtkDir, level } = useLdtkLevelContext()

  const { tileset, texture } = useMemo(() => {
    const tilesetUid = layer.__tilesetDefUid
    const tileset = tilesetUid ? getTilesetByUid(ldtk.defs.tilesets, tilesetUid) : undefined
    const texture = tileset && tileset.relPath ? getTilesetTexture(ldtkDir + tileset.relPath) : undefined
    return { tileset, texture }
  }, [ldtk, ldtkDir, layer.__tilesetDefUid])

  if (!layer.visible) return null

  return (
    <LdtkLayerContext value={{
      layer,
      tileset,
      texture,
      layerPxDimensions: [layer.__cWid * layer.__gridSize, layer.__cHei * layer.__gridSize],
      layerPxOffsets: [layer.__pxTotalOffsetX + level.worldX, layer.__pxTotalOffsetY + (level.worldY + level.pxHei)],
    }}
    >
      {layer.__type === "IntGrid" && <IntGridLayerRenderer />}
      {layer.__type === "Tiles" && <TilesLayerRenderer />}
      {layer.__type === "Entities" && <EntitiesLayerRenderer />}
    </LdtkLayerContext>
  )
};

export const LdtkLayerContext = createContext<{
  layer: LayerInstance
  tileset?: TilesetDefinition
  texture?: THREE.Texture
  layerPxDimensions: [number, number]
  layerPxOffsets: [number, number]
} | null>(null)

export const useLdtkLayerContext = () => {
  const context = useContext(LdtkLayerContext)
  if (!context) {
    throw new Error("useLdtkLayerContext must be used within a LdtkLayerContext provider")
  }
  return context
}
