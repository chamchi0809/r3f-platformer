import type {KeyboardControlsEntry, KeyboardControlsProps} from "@react-three/drei";

export type KeyboardControlType = "left" | "right" | "up" | "down";

export const keyboardControlMap: KeyboardControlsEntry<KeyboardControlType>[] = [
    {name: "left", keys: ["KeyA"]},
    {name: "right", keys: ["KeyD"]},
    {name: "up", keys: ["KeyW"]},
    {name: "down", keys: ["KeyS"]},
]