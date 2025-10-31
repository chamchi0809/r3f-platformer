import {trait} from "koota";
import type {Collider, KinematicCharacterController, World} from "@dimforge/rapier2d";
import {deg2rad} from "@/common/utils/mathUtils.ts";

export const CharacterControllerRef = trait(() => ({}) as unknown as CharacterController);

export class CharacterController {
    world: World;
    collider: Collider;
    controller: KinematicCharacterController;

    constructor(collider: Collider, world: World) {
        this.world = world;
        this.collider = collider;
        this.controller = world.createCharacterController(0.01);
        this.controller.setUp({x: 0, y: 1});
        this.controller.setMaxSlopeClimbAngle(deg2rad(45));
        this.controller.enableAutostep(0.1, 0.01, true);
        this.controller.enableSnapToGround(0.5);
        this.controller.setApplyImpulsesToDynamicBodies(true);
    }

    get col() {
        return this.world.getCollider(this.collider.handle);
    }

    get isGrounded() {
        const checkDist = 0.01;
        this.controller.computeColliderMovement(this.col, {x: 0, y: -checkDist * 2}, undefined, this.col.collisionGroups());
        return Math.abs(this.controller.computedMovement().y) < checkDist;
    }

    move(x: number, y: number) {
        this.controller.computeColliderMovement(this.col, {x, y}, undefined, this.col.collisionGroups());
        this.col.setTranslation({
            x: this.col.translation().x + this.controller.computedMovement().x,
            y: this.col.translation().y + this.controller.computedMovement().y,
        });
    }

    cleanup() {
        this.world.removeCharacterController(this.controller);
    }
}