import { NearestFilter, Texture, TextureLoader } from "three";
import { getSafePath } from "@/common/utils/electronUtils.ts";

const textureCache: Record<string, Texture> = {};

export const getTexture = (publicPath: string): Texture => {
  const safePath = getSafePath(publicPath);
  if (!textureCache[safePath]) {
    textureCache[safePath] = new TextureLoader().load(safePath);
    textureCache[safePath].magFilter = NearestFilter;
    textureCache[safePath].minFilter = NearestFilter;
  }
  return textureCache[safePath];
};
