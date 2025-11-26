import { trait } from "koota";
import { createSpriteAnimDef, type SpriteAnimDef } from "@/common/traits/SpriteAnim.ts";

export type RhythmAnimTuple = [
  SpriteAnimDef,
  SpriteAnimDef,
  SpriteAnimDef,
  SpriteAnimDef,
  SpriteAnimDef,
  SpriteAnimDef,
  SpriteAnimDef,
  SpriteAnimDef,
];
export const RhythmAnims = trait<() => RhythmAnimTuple>(() => [
  createSpriteAnimDef(),
  createSpriteAnimDef(),
  createSpriteAnimDef(),
  createSpriteAnimDef(),
  createSpriteAnimDef(),
  createSpriteAnimDef(),
  createSpriteAnimDef(),
  createSpriteAnimDef(),
] as const);
