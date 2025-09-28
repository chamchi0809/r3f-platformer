import {trait} from "koota";
import type {Collider, World} from "@dimforge/rapier3d-compat";

export const ColliderRef = trait(() => ({}) as unknown as ColliderGetter);

export class ColliderGetter {
    collider: Collider;
    world: World;

    get col() {
        return this.world.getCollider(this.collider.handle);
    }

    constructor(collider: Collider, world: World) {
        this.collider = collider;
        this.world = world;
    }
}