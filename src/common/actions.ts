import { createActions } from "koota";
import { IsCamera } from "@/common/traits/IsCamera.ts";
import { CameraSize } from "@/common/traits/CameraSize.ts";
import { CAM_SIZE } from "@/common/defs/camSize.ts";

export const actions = createActions(world => ({
  spawnCamera: () => world.spawn(IsCamera, CameraSize({ size: CAM_SIZE })),
}));
