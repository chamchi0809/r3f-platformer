import type { EntityInstance, LayerInstance, TilesetDefinition } from "@/common/ldtk/models/LdtkTypes.ts";
import * as THREE from "three";
import { Fragment, type JSX } from "react";
import { useLdtkLayerContext } from "@/common/ldtk/components/layers/LayerRenderer.tsx";
import { useLdtkLevelContext } from "@/common/ldtk/components/LdtkMap.tsx";

export interface EntityRendererProps {
  entity: EntityInstance
  layer: LayerInstance
  tileset?: TilesetDefinition
  texture?: THREE.Texture
  layerPxOffsets: [number, number]
  layerPxDimensions: [number, number]
}

export type EntityRenderer = (props: EntityRendererProps) => JSX.Element | null;

export type EntityRendererMap = Record<string, EntityRenderer>;

export default function EntitiesLayerRenderer() {
  const { layer, tileset, texture, layerPxOffsets, layerPxDimensions } = useLdtkLayerContext();
  const { entityRendererMap } = useLdtkLevelContext();

  return (
    <>
      {layer.entityInstances.map((entity) => {
        const MatchingEntityRenderer = entityRendererMap?.[entity.__identifier];
        if (!MatchingEntityRenderer) return null;
        return (
          <MatchingEntityRenderer
            key={entity.iid}
            entity={entity}
            layer={layer}
            tileset={tileset}
            texture={texture}
            layerPxOffsets={layerPxOffsets}
            layerPxDimensions={layerPxDimensions}
          />
        );
      })}
    </>
  );
}
