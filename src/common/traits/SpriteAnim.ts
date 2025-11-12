import { trait, type World } from "koota";
import { Elapsed } from "@/common/traits/Elapsed.ts";
import { getTexture } from "@/common/utils/textureUtils.ts";
import type { Texture } from "three";

export interface SpriteAnimDef {
  // start and end frame index (in ascending order)
  range: [number, number]
  // function to get the texture path for a given frame index
  getPath: (index: number) => string
  // function to get the UV mapping for a given frame index and total length
  getUVs?: (index: number, length: number) => [uvw: number, uvx: number]
  // duration of each frame in seconds
  frameDuration?: number
  // whether the animation should loop
  loop?: boolean
}

export const SpriteAnim = trait(() => null! as SpriteAnimImpl);

export class SpriteAnimImpl implements SpriteAnimDef {
  range: [number, number];
  getPath: (index: number) => string;
  getUVs: (index: number, length: number) => [uvw: number, uvx: number];
  current: number;
  timestamp: number;
  frameDuration = 0.1;
  loop = true;
  private textureCache: Map<`${string}-${number}-${number}`, Texture> = new Map();

  constructor(
    world: World,
    def: SpriteAnimDef,
  ) {
    const { range, getPath, getUVs = () => [1, 0], frameDuration = 0.1, loop = true } = def;
    this.range = range;
    this.getPath = getPath;
    this.getUVs = getUVs;
    this.current = range[0];
    this.timestamp = world.get(Elapsed)!.value;
    this.frameDuration = frameDuration;
    this.loop = loop;
  }

  tick(world: World) {
    const elapsed = world.get(Elapsed)!.value;
    const delta = elapsed - this.timestamp;
    if (delta >= this.frameDuration) {
      this.current += 1;
      if (this.current > this.range[1]) {
        if (this.loop) {
          this.current = this.range[0];
        }
        else {
          this.current = this.range[1];
        }
      }
      this.timestamp = elapsed;
    }
  }

  getCurrentFrameTexture() {
    const path = this.getPath(Math.floor(this.current));
    const uvs = this.getUVs(Math.floor(this.current), this.range[1] - this.range[0] + 1);
    const cacheKey = `${path}-${uvs[0]}-${uvs[1]}` as const;

    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey)!;
    }
    const cutTexture = getTexture(path).clone();
    const [uvw, uvx] = uvs;
    cutTexture.repeat.set(uvw, 1);
    cutTexture.offset.set(uvx, 0);
    cutTexture.needsUpdate = true;
    this.textureCache.set(cacheKey, cutTexture);
    return cutTexture;
  }

  restart() {
    this.current = this.range[0];
  }

  changeRange(range: [number, number]) {
    this.range = range;
    this.restart();
  }

  changePathGetter(getPath: (index: number) => string) {
    this.getPath = getPath;
    this.restart();
  }
}
