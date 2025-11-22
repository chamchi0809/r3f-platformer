import type { KeyboardControlType } from "@/common/defs/keyboardControlMap.ts";
import { pressedTransformInput } from "@/common/systems/pressed/pressedTransformInput.ts";
import { pressedInteractInput } from "@/common/systems/pressed/pressedInteractInput.ts";
import useOnKeyboardPress from "@/common/hooks/input/useOnKeyboardPress.ts";

export default function KeyboardEvents() {
  useOnKeyboardPress<KeyboardControlType>("transform", pressedTransformInput);
  useOnKeyboardPress<KeyboardControlType>("interact", pressedInteractInput);

  return <></>;
}
