import type {KeyboardControlsEntry} from "@react-three/drei";

export type KeyboardControlType = "left" | "right" | "up" | "down" | "jump" | "transform";

export const keyboardControlMap: KeyboardControlsEntry<KeyboardControlType>[] = [
    {name: "left", keys: ["KeyA"]},
    {name: "right", keys: ["KeyD"]},
    {name: "up", keys: ["KeyW"]},
    {name: "down", keys: ["KeyS"]},
    {name: "jump", keys: ["Space"]},
    {name: "transform", keys: ["ShiftLeft", "ShiftRight"]},
]