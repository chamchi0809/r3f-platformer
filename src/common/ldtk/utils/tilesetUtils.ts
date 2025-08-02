import * as THREE from 'three';
import type {TilesetDefinition} from "@/common/ldtk/models/LdtkTypes.ts";
import {TextureLoader} from "three";


export const getTilesetByUid = (tilesets: TilesetDefinition[], uid: number): TilesetDefinition | undefined =>{
    return tilesets.find(ts => ts.uid === uid);
}

const textureCache: Record<string, THREE.Texture> = {};

export const getTilesetTexture = (publicPath: string): THREE.Texture => {
    if (!textureCache[publicPath]) {
        textureCache[publicPath] = new TextureLoader().load(publicPath);
        textureCache[publicPath].magFilter = THREE.NearestFilter;
        textureCache[publicPath].minFilter = THREE.NearestFilter;
    }
    return textureCache[publicPath];
}