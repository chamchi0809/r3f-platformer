import { trait, type World } from "koota";
import { Elapsed } from "@/common/traits/Elapsed.ts";
import { getTexture } from "@/common/utils/textureUtils.ts";

export interface SpriteAnimDef {
  range: [number, number]
  getPath: (index: number) => string
  frameDuration?: number
  loop?: boolean
}

export const SpriteAnim = trait(() => null! as SpriteAnimImpl);

export class SpriteAnimImpl implements SpriteAnimDef {
  range: [number, number];
  getPath: (index: number) => string;
  current: number;
  timestamp: number;
  frameDuration = 0.1;
  loop = true;

  constructor(
    world: World,
    def: SpriteAnimDef,
  ) {
    const { range, getPath, frameDuration = 0.1, loop = true } = def;
    this.range = range;
    this.getPath = getPath;
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
    return getTexture(this.getPath(Math.floor(this.current)));
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
