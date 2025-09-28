import {trait} from "koota";
import {Vector2} from "three";

export const CharacterVelocity = trait(() => new Vector2(0, 0));
export const CharacterJumpBuffer = trait(() => ({time: 0, duration: 0.2}));