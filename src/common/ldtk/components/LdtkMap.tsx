import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import type {Ldtk, Level} from "@/common/ldtk/models/LdtkTypes.ts";
import LayerRenderer from "@/common/ldtk/components/layers/LayerRenderer.tsx";
import type {EntityRendererMap} from "@/common/ldtk/components/layers/EntitiesLayerRenderer.tsx";

export const LdtkLevelContext = createContext<{
    ldtk: Ldtk;
    ldtkPath: string;
    level: Level;
    entityRendererMap?: EntityRendererMap;
} | null>(null);

export default function LdtkMap(
    {
        ldtkPath,
        levelIdentifier,
        entityRendererMap,
    }: {
        ldtkPath: string;
        levelIdentifier?: string; // Optional level identifier to render a specific level
        entityRendererMap?: EntityRendererMap; // Optional entity renderer map
    }) {

    const [ldtk, setLdtk] = useState<Ldtk | undefined>(undefined);

    useEffect(() => {
        fetch(ldtkPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setLdtk(data as Ldtk);
            })
    }, []);

    // Find the level to render
    const level = useMemo(() => {
        if (!ldtk) return undefined;

        if (levelIdentifier) {
            return ldtk.levels.find(lvl => lvl.identifier === levelIdentifier);
        }
        return ldtk.levels[0];
    }, [ldtk, levelIdentifier]);

    if (!level || !ldtk) return null;

    return <LdtkLevelContext value={{
        ldtk,
        level,
        ldtkPath,
        entityRendererMap,
    }}>
        <group>
            {(level.layerInstances ?? []).map((layer, i) => {

                return <LayerRenderer
                    key={layer.iid}
                    layer={layer}
                />
            })}
        </group>
    </LdtkLevelContext>
};

export const useLdtkLevelContext = () => {
    const context = useContext(LdtkLevelContext);
    if (!context) {
        throw new Error("useLdtkLevelContext must be used within a LdtkMap component");
    }
    return context;
}