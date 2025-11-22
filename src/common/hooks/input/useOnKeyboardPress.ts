import { useKeyboardControls } from "@react-three/drei";
import { useEffect } from "react";

export default function useOnKeyboardPress<T extends string>(key: T, cb: () => void) {
  const [subInput] = useKeyboardControls<T>();

  useEffect(() => {
    return subInput(
      state => state[key],
      (pressed) => {
        if (pressed) cb();
      },
    );
  }, []);
}
