import {Collider, Vector3} from "@dimforge/rapier3d-compat";
import * as THREE from "three";

export const colliderPlaceholder = {} as unknown as Collider;

export const vector2To3 = (v2: THREE.Vector2, z = 0) => new Vector3(v2.x, v2.y, z);