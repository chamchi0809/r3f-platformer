import { trait } from "koota";
import { createSpriteAnimDef } from "@/common/traits/SpriteAnim.ts";

export const RhythmAnims = trait({
  ["1"]: () => createSpriteAnimDef(),
  ["2"]: () => createSpriteAnimDef(),
  ["3"]: () => createSpriteAnimDef(),
  ["4"]: () => createSpriteAnimDef(),
  ["5"]: () => createSpriteAnimDef(),
  ["6"]: () => createSpriteAnimDef(),
  ["7"]: () => createSpriteAnimDef(),
  ["8"]: () => createSpriteAnimDef(),
});
