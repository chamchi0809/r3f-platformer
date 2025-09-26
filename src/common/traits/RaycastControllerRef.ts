import {trait} from "koota";
import * as THREE from "three";
import {Collider, Cuboid, type InteractionGroups, ShapeType} from "@dimforge/rapier3d-compat";
import {colliderPlaceholder} from "@/common/utils/rapierUtils.ts";

export interface RaycastOrigins {
    topLeft: THREE.Vector2;
    topRight: THREE.Vector2;
    bottomLeft: THREE.Vector2;
    bottomRight: THREE.Vector2;
}

export const RaycastControllerRef = trait(() => new RaycastController(colliderPlaceholder));

export class RaycastController {
    public collider: Collider;
    public collisionGroups: InteractionGroups = 0;
    raycastOrigins: RaycastOrigins = {
        topLeft: new THREE.Vector2(),
        topRight: new THREE.Vector2(),
        bottomLeft: new THREE.Vector2(),
        bottomRight: new THREE.Vector2(),
    };
    skinWidth = 0.02;
    dstBetweenRays = 0.2;
    horizontalRayCount = 4;
    verticalRayCount = 4;
    horizontalRaySpacing = 0;
    verticalRaySpacing = 0;

    public updateRaycastOrigins() {
        var bounds = this.getBounds();
        if (!bounds) return;

        this.raycastOrigins.topLeft.set(bounds.min.x, bounds.max.y);
        this.raycastOrigins.topRight.set(bounds.max.x, bounds.max.y);
        this.raycastOrigins.bottomLeft.set(bounds.min.x, bounds.min.y);
        this.raycastOrigins.bottomRight.set(bounds.max.x, bounds.min.y);
    }

    calculateRaySpacing() {
        var bounds = this.getBounds();
        if (!bounds) return;

        const width = bounds.max.x - bounds.min.x;
        const height = bounds.max.y - bounds.min.y;

        this.horizontalRayCount = Math.max(2, this.horizontalRayCount);
        this.verticalRayCount = Math.max(2, this.verticalRayCount);

        this.horizontalRaySpacing = height / (this.horizontalRayCount - 1);
        this.verticalRaySpacing = width / (this.verticalRayCount - 1);
    }

    getBounds(): THREE.Box3 | null {
        if (this.collider.shape.type !== ShapeType.Cuboid) return null;
        const cuboid = this.collider.shape as Cuboid;
        return new THREE.Box3(
            new THREE.Vector3(-cuboid.halfExtents.x, -cuboid.halfExtents.y, -cuboid.halfExtents.z).add(this.collider.translation()),
            new THREE.Vector3(cuboid.halfExtents.x, cuboid.halfExtents.y, cuboid.halfExtents.z).add(this.collider.translation())
        );
    }

    translate(offset: THREE.Vector2) {
        const current = this.collider.translation();
        this.collider.setTranslation({...current, x: current.x + offset.x, y: current.y + offset.y});
        this.updateRaycastOrigins();
    }

    setTranslation(position: THREE.Vector3) {
        this.collider.setTranslation(position);
        this.updateRaycastOrigins();
    }

    constructor(Collider: Collider) {
        this.collider = Collider;
        this.calculateRaySpacing();
        this.collisionGroups = this.collider.collisionGroups();
    }
}