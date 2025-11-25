import { traitWithActions } from "@/common/utils/ecsUtils.ts";

export const MoveInput = traitWithActions({
  x: 0,
  y: 0,
}, {
  reset: (value, defaultVal: number) => {
    value.x = defaultVal;
    value.y = defaultVal;
  },
  set: (value, x: number, y: number) => {
    value.x = x;
    value.y = y;
  },
});
