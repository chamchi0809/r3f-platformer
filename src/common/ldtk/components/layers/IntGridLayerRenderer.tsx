import InstancedTilesRenderer from "@/common/ldtk/components/tiles/InstancedTilesRenderer.tsx";
import { Fragment, type JSX, useMemo } from "react";
import { useLdtkLayerContext } from "@/common/ldtk/components/layers/LayerRenderer.tsx";
import type { TileInstance, TilesetDefinition } from "@/common/ldtk/models/LdtkTypes.ts";
import * as THREE from "three";
import { useLdtkLevelContext } from "@/common/ldtk/components/LdtkMap.tsx";

export default function IntGridLayerRenderer() {
  const { tileRendererMap } = useLdtkLevelContext();

  const {
    layer,
    tileset,
    texture,
    layerPxDimensions,
    layerPxOffsets,
  } = useLdtkLayerContext();

  // Group tiles by their enum tags
  const { taggedTiles, untaggedTiles } = useMemo(() => {
    if (!tileset) return { taggedTiles: {}, untaggedTiles: [] };

    const tagged: Record<string, TileInstance[]> = {};
    const untagged: TileInstance[] = [];

    layer.autoLayerTiles.forEach((tile) => {
      const enumTag = tileset.enumTags.find(tag => tag.tileIds.includes(tile.t));
      if (enumTag?.enumValueId && tileRendererMap?.[enumTag.enumValueId]) {
        if (!tagged[enumTag.enumValueId]) {
          tagged[enumTag.enumValueId] = [];
        }
        tagged[enumTag.enumValueId].push(tile);
      }
      else {
        untagged.push(tile);
      }
    });

    return { taggedTiles: tagged, untaggedTiles: untagged };
  }, [layer.autoLayerTiles, tileset, tileRendererMap]);

  if (!tileset || !texture) return null;

  return (
    <>
      {/* Render untagged tiles using instanced rendering */}
      {untaggedTiles.length > 0 && (
        <InstancedTilesRenderer
          tiles={untaggedTiles}
          tileset={tileset}
          texture={texture}
          tileSize={layer.__gridSize}
          layerPxDimensions={layerPxDimensions}
          layerPxOffsets={layerPxOffsets}
        />
      )}

      {/* Render tagged tiles individually (for custom renderers) */}
      {Object.entries(taggedTiles).map(([tagId, tiles]) => (
        <Fragment key={tagId}>
          <InstancedTilesRenderer
            tiles={tiles}
            tileset={tileset}
            texture={texture}
            tileSize={layer.__gridSize}
            layerPxDimensions={layerPxDimensions}
            layerPxOffsets={layerPxOffsets}
          />
          {tiles.map((tile, i) => {
            const tileRenderer = tileRendererMap?.[tagId];
            const baseTileRendererProps: BaseTileRendererProps = {
              tile,
              tileset,
              texture,
              tileSize: layer.__gridSize,
              layerPxOffsets,
              layerPxDimensions,
            };

            return (
              <Fragment key={i}>
                {tileRenderer && tileRenderer(baseTileRendererProps)}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </>
  );
}

export interface BaseTileRendererProps {
  tile: TileInstance
  tileset: TilesetDefinition
  texture: THREE.Texture
  tileSize: number
  layerPxDimensions: [number, number]
  layerPxOffsets: [number, number]
}

export type TileRenderer = (props: BaseTileRendererProps) => JSX.Element | null;

// Tileset Enum Tag -> TileColliderRenderer
export type TileRendererMap = Record<string, TileRenderer>;
