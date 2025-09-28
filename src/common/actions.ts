import {createActions} from "koota";
import {IsCamera} from "@/common/traits/IsCamera.ts";
import {MoveInput} from "@/common/traits/MoveInput.ts";
import {IsPlayer} from "@/common/traits/IsPlayer.ts";
import {StartPosition} from "@/common/traits/StartPosition.ts";
import {Vector2} from "three";
import {CharacterVelocity} from "@/common/traits/CharacterValues.ts";
import {CharacterStats} from "@/common/traits/CharacterStats.ts";
import {JumpInput} from "@/common/traits/JumpInput.ts";

export const actions = createActions(world => ({
    spawnCamera: () => world.spawn(IsCamera),
    spawnPlayer: (startPosition: Vector2) => world.spawn(IsPlayer, StartPosition(startPosition),
        MoveInput(new Vector2(0, 0)), JumpInput,
        CharacterVelocity,
        CharacterStats.speed(5), CharacterStats.jumpStrength(8)
    ),
}));