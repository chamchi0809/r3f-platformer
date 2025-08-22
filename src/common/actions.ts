import {createActions} from "koota";
import {IsCamera} from "@/common/traits/IsCamera.ts";

export const actions = createActions(world => ({
    spawnCamera: () => world.spawn(IsCamera),
}))