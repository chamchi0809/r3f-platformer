import { useWorld } from "koota/react";
import { useKeyboardControls } from "@react-three/drei";
import type { RhythmControlType } from "@/common/defs/keyboardControlMap.ts";
import { useEffect } from "react";
import { pressedRhythmInput } from "@/common/systems/pressed/pressedRhythmInput.tsx";

export default function RhythmKeyboardEvents() {
  const world = useWorld();
  const [subInput] = useKeyboardControls<RhythmControlType>();

  ([1, 2, 3, 4] as const)
    .forEach((num) => {
      useEffect(() => {
        return subInput(
          state => state[`rhythm ${num}`],
          (pressed) => {
            if (pressed) pressedRhythmInput(world, num);
          },
        );
      }, []);
    });

  return <></>;
}
