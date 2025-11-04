import { createContext, use, useContext } from 'react'
import type { Ldtk, Level } from '@/common/ldtk/models/LdtkTypes.ts'
import LayerRenderer from '@/common/ldtk/components/layers/LayerRenderer.tsx'
import type { EntityRendererMap } from '@/common/ldtk/components/layers/EntitiesLayerRenderer.tsx'
import type { TileRendererMap } from '@/common/ldtk/components/layers/TilesLayerRenderer.tsx'

export const LdtkLevelContext = createContext<{
  ldtk: Ldtk
  ldtkPath: string
  ldtkDir: string
  level: Level
  entityRendererMap?: EntityRendererMap
  tileRendererMap?: TileRendererMap
} | null>(null)

const ldtkPromise = fetch('/assets/ldtk/map.ldtk')
  .then(response => response.json())
  .then(data => data as Ldtk)

export default function LdtkMap(
  {
    ldtkPath,
    levelIds,
    entityRendererMap,
    tileRendererMap,
  }: {
    ldtkPath: string
    levelIds?: string[] // Optional level identifier to render a specific level
    entityRendererMap?: EntityRendererMap // Optional entity renderer map
    tileRendererMap?: TileRendererMap // Optional tile renderer map
  }) {
  const ldtk = use(ldtkPromise)

  const levels = levelIds
    ? ldtk.levels.filter(lvl => levelIds.includes(lvl.identifier))
    : ldtk.levels

  return levels.map((level) => {
    return (
      <LdtkLevelContext value={{
        ldtk,
        level,
        ldtkPath,
        ldtkDir: ldtkPath.substring(0, ldtkPath.lastIndexOf('/')) + '/',
        entityRendererMap,
        tileRendererMap,
      }}
      >
        <group>
          {(level.layerInstances ?? []).map((layer) => {
            return (
              <LayerRenderer
                key={layer.iid}
                layer={layer}
              />
            )
          })}
        </group>
      </LdtkLevelContext>
    )
  })
};

export const useLdtkLevelContext = () => {
  const context = useContext(LdtkLevelContext)
  if (!context) {
    throw new Error('useLdtkLevelContext must be used within a LdtkMap component')
  }
  return context
}
