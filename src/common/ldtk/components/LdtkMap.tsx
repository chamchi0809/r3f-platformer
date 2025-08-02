import React, {useEffect, useMemo, useState} from "react";
import * as THREE from "three";
import type {Ldtk, TilesetDefinition} from "@/common/ldtk/models/LdtkTypes.ts";
import LayerRenderer from "@/common/ldtk/components/LayerRenderer.tsx";
import {getTilesetByUid, getTilesetTexture} from "@/common/ldtk/utils/tilesetUtils.ts";

export default function LdtkMap(
    {
        ldtkPath,
        levelIdentifier,
    }: {
        ldtkPath: string;
        levelIdentifier?: string; // Optional level identifier to render a specific level
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

    // For each layer, find its tileset if applicable
    return <group>
        {(level.layerInstances || []).map((layer, i) => {
            let tileset: TilesetDefinition | undefined;
            let texture: THREE.Texture | undefined;
            // For tile layers, get tileset
            const tilesetUid = layer.__tilesetDefUid;
            if (tilesetUid) {
                tileset = getTilesetByUid(ldtk.defs.tilesets, tilesetUid);
                if (tileset && tileset.relPath) {
                    const ldtkDir = ldtkPath.substring(0, ldtkPath.lastIndexOf("/")) + "/";
                    texture = getTilesetTexture(ldtkDir + tileset.relPath);
                }
            }
            return <LayerRenderer
                key={layer.iid}
                layer={layer}
                tileset={tileset}
                texture={texture}
                levelHeight={level.pxHei}
            />
        })}
    </group>
};