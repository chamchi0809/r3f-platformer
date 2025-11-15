import type { KeyboardControlsEntry } from "@react-three/drei";

export type KeyboardControlType = "left" | "right" | "up" | "down" | "jump" | "transform" | "interact" | "rhythm 1" | "rhythm 2" | "rhythm 3" | "rhythm 4";

export const keyboardControlMap: KeyboardControlsEntry<KeyboardControlType>[] = [
  { name: "left", keys: ["KeyA"] },
  { name: "right", keys: ["KeyD"] },
  { name: "up", keys: ["KeyW"] },
  { name: "down", keys: ["KeyS"] },
  { name: "jump", keys: ["Space"] },
  { name: "transform", keys: ["ShiftLeft", "ShiftRight"] },
  { name: "interact", keys: ["KeyQ"] },
];

export type RhythmControlType = "rhythm 1" | "rhythm 2" | "rhythm 3" | "rhythm 4";

export const rhythmControlMap: KeyboardControlsEntry<RhythmControlType>[] = [
  { name: "rhythm 1", keys: ["KeyC"] },
  { name: "rhythm 2", keys: ["KeyV"] },
  { name: "rhythm 3", keys: ["KeyN"] },
  { name: "rhythm 4", keys: ["KeyM"] },
];
