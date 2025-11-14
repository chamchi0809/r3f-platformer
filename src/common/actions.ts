import { createActions } from "koota";
import { IsCamera } from "@/common/traits/IsCamera.ts";
import { MoveInput } from "@/common/traits/MoveInput.ts";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import { CharacterStartPosition } from "@/common/traits/CharacterStartPosition.ts";
import { Vector2 } from "three";
import { CharacterVelocity } from "@/common/traits/CharacterValues.ts";
import { CharacterStats } from "@/common/traits/CharacterStats.ts";
import { JumpInput } from "@/common/traits/JumpInput.ts";
import { PlayerStates } from "@/common/traits/PlayerStates.ts";
import { CharacterVisualPosition } from "@/common/traits/CharacterVisualPosition.ts";
import { IsNPC } from "@/common/traits/IsNPC.ts";
import { IsEnemy } from "@/common/traits/IsEnemy.ts";
import { SpriteAnim, SpriteAnimImpl } from "@/common/traits/SpriteAnim.ts";
import type { EntityInstance } from "@/common/ldtk/models/LdtkTypes.ts";
import { stripEntityInstanceFields } from "@/common/ldtk/utils/entityUtils.ts";

export const actions = createActions(world => ({
  spawnCamera: () => world.spawn(IsCamera),
  spawnPlayer: (startPosition: Vector2) => world.spawn(
    IsPlayer, PlayerStates,
    MoveInput(new Vector2(0, 0)), JumpInput,
    CharacterStartPosition(startPosition.clone()), CharacterVisualPosition(startPosition.clone()), CharacterVelocity,
    CharacterStats.speed(5), CharacterStats.jumpStrength(12),
    SpriteAnim(new SpriteAnimImpl({
      path: "/assets/img/dancing/hips.png",
      length: 8,
    })),
  ),
  spawnNPC: (
    {
      startPosition,
      entityInstance,
      ldtkDir,
    }: {
      startPosition: Vector2
      entityInstance: EntityInstance
      ldtkDir?: string
    }) => {
    const {
      Idle,
    } = stripEntityInstanceFields<{
      Idle: string
    }>(entityInstance);

    world.spawn(
      IsNPC,
      CharacterStartPosition(startPosition.clone()), CharacterVisualPosition(startPosition.clone()),
      SpriteAnim(new SpriteAnimImpl({
        path: `${ldtkDir}${Idle.trim()}`,
        length: 8,
      })),
    );
  },
  spawnEnemy: (startPosition: Vector2) => world.spawn(
    IsEnemy,
    CharacterStartPosition(startPosition.clone()), CharacterVisualPosition, CharacterVelocity,
    CharacterStats.speed(3), CharacterStats.jumpStrength(8),
    SpriteAnim(new SpriteAnimImpl({
      path: "/assets/img/dancing/hips.png",
      length: 8,
    })),
  ),
}));
