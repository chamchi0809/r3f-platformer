import { trait } from "koota";

// TODO: 대사 애니메이션
export const InteractLine = trait({
  lines: () => [] as string[],
  current: 0,
  animIndex: 0,
  animDelta: 0,
});
