import { trait } from "koota";

export const InteractLine = trait({
  lines: () => [] as string[],
  current: 0,
  animIndex: 0,
  animDelta: 0,
});
