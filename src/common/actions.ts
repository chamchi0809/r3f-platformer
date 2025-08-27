import {createActions} from "koota";
import {IsCamera} from "@/common/traits/IsCamera.ts";
import {MoveInput} from "@/common/traits/MoveInput.ts";
import {IsPlayer} from "@/common/traits/IsPlayer.ts";

export const actions = createActions(world => ({
    spawnCamera: () => world.spawn(IsCamera),
    spawnPlayer: () => world.spawn(IsPlayer, MoveInput),
}))