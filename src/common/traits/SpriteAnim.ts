import { trait, type World } from "koota";
import { Elapsed } from "@/common/traits/Elapsed.ts";
import { getTexture } from "@/common/utils/textureUtils.ts";
import type { Texture } from "three";

export interface SpriteAnimDef {
  // length
  length: number
  // sprite sheet path
  path: string
  // duration of each frame in seconds
  frameDuration?: number
  // whether the animation should loop
  loop?: boolean
  // play in reverse direction
  reverse?: boolean
}

export const createSpriteAnimDef = () => ({
  length: 1,
  path: "",
  loop: false,
  reverse: false,
  frameDuration: 0.1,
}) as SpriteAnimDef;

export const SpriteAnim = trait(() => null! as SpriteAnimImpl);

export class SpriteAnimImpl implements SpriteAnimDef {
  length: number;
  path: string;
  current: number;
  timestamp: number | undefined = undefined;
  frameDuration = 0.1;
  loop = false;
  reverse = false;
  private textureCache: Map<`${string}-${number}-${number}`, Texture> = new Map();

  constructor(def: SpriteAnimDef) {
    const { length, path, frameDuration = 0.1, loop = false, reverse = false } = def;
    this.length = length;
    this.path = path;
    this.frameDuration = frameDuration;
    this.loop = loop;
    this.reverse = reverse;

    this.current = this.getStartIndex();
  }

  getStartIndex() {
    return this.reverse ? this.length - 1 : 0;
  }

  changeDef(def: Partial<SpriteAnimDef>) {
    if (def.length) {
      this.length = def.length;
    }
    if (def.path) {
      this.path = def.path;
    }
    if (def.frameDuration !== undefined) {
      this.frameDuration = def.frameDuration;
    }
    if (def.loop !== undefined) {
      this.loop = def.loop;
    }
    if (def.reverse !== undefined) {
      this.reverse = def.reverse;
    }
    this.restart();
  }

  tick(world: World) {
    const elapsed = world.get(Elapsed)!.value;

    if (this.timestamp === undefined) {
      this.timestamp = elapsed;
      return;
    }

    const delta = elapsed - this.timestamp;
    if (delta >= this.frameDuration) {
      if (this.reverse) {
        this.current -= 1;
        if (this.current < 0) {
          if (this.loop) {
            this.current = this.length - 1;
          }
          else {
            this.current = 0;
          }
        }
      }
      else {
        this.current += 1;
        if (this.current > this.length - 1) {
          if (this.loop) {
            this.current = 0;
          }
          else {
            this.current = this.length - 1;
          }
        }
      }
      this.timestamp = elapsed;
    }
  }

  getCurrentFrameTexture() {
    const path = this.path;
    const uvs = [1 / this.length, this.current / this.length] as [uvw: number, uvx: number];
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
    this.current = this.getStartIndex();
  }

  changeLength(length: number) {
    this.length = length;
    this.restart();
  }

  changePath(path: string) {
    this.path = path;
    this.restart();
  }

  isPlaying(animDef: Partial<SpriteAnimDef>) {
    if (animDef.length !== undefined && animDef.length !== this.length) {
      return false;
    }
    if (animDef.path !== undefined && animDef.path !== this.path) {
      return false;
    }
    if (animDef.frameDuration !== undefined && animDef.frameDuration !== this.frameDuration) {
      return false;
    }
    if (animDef.loop !== undefined && animDef.loop !== this.loop) {
      return false;
    }
    if (animDef.reverse !== undefined && animDef.reverse !== this.reverse) {
      return false;
    }
    return true;
  }
}
