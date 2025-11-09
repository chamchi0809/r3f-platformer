import type { Entity } from "koota";
import { useWorld } from "koota/react";
import { useEffect } from "react";
import { SpriteAnim, type SpriteAnimDef, SpriteAnimImpl } from "@/common/traits/SpriteAnim.ts";

export const useSpriteAnimInjector = (entity: Entity, def: SpriteAnimDef) => {
  const world = useWorld();

  useEffect(() => {
    entity.add(SpriteAnim(
      new SpriteAnimImpl(world, def),
    ));

    return () => {
      entity.remove(SpriteAnim);
    };
  }, []);
};
