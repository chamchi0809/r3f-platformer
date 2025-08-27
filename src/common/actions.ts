import {createActions} from "koota";
import {IsCamera} from "@/common/traits/IsCamera.ts";
import {MoveInput} from "@/common/traits/MoveInput.ts";
import {IsPlayer} from "@/common/traits/IsPlayer.ts";
import {StartPosition} from "@/common/traits/StartPosition.ts";
import {Vector2} from "three";

export const actions = createActions(world => ({
    spawnCamera: () => world.spawn(IsCamera),
    spawnPlayer: (startPosition: Vector2) => world.spawn(IsPlayer, MoveInput(new Vector2(0, 0)), StartPosition(startPosition)),
}))