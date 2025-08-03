import type {EntityInstance, LayerInstance, TilesetDefinition} from "@/common/ldtk/models/LdtkTypes.ts";
import * as THREE from "three";
import {Fragment, type JSX} from "react";
import {useLdtkLayerContext} from "@/common/ldtk/components/layers/LayerRenderer.tsx";
import {useLdtkLevelContext} from "@/common/ldtk/components/LdtkMap.tsx";

export interface EntityRendererProps {
    entity: EntityInstance;
    layer: LayerInstance;
    tileset?: TilesetDefinition;
    texture?: THREE.Texture;
}

export type EntityRenderer = (props: EntityRendererProps) => JSX.Element | null;

export type EntityRendererMap = Record<string, EntityRenderer>;

export default function EntitiesLayerRenderer() {

    const {layer, tileset, texture} = useLdtkLayerContext();
    const {entityRendererMap} = useLdtkLevelContext();

    return <>
        {layer.entityInstances.map(entity => {
            return <Fragment key={entity.iid}>
                {entityRendererMap?.[entity.__identifier]?.({
                    entity,
                    layer,
                    tileset,
                    texture,
                })}
            </Fragment>
        })}
    </>
}