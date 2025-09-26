import {trait} from "koota";
import type {InteractionGroups, World} from "@dimforge/rapier3d-compat";
import {Vector2} from "three";
import type {RaycastController} from "@/common/traits/RaycastControllerRef.ts";

interface CollisionInfo {
    above: boolean;
    below: boolean;
    grounded: boolean;
    left: boolean;
    right: boolean;
    wall: boolean;
    head: boolean;
    climbingSlope: boolean;
    descendingSlope: boolean;
    slidingDownMaxSlope: boolean;
    slopeAngle: number;
    slopeAngleOld: number;
    slopeNormal: Vector2;
    moveAmountOld: Vector2;
    faceDir: number;
    fallingThroughPlatform: boolean;
    reset: () => void;
}

export const GroundControllerRef = trait(() => ({}));

export class GroundController {
    public maxSlopeAngle: number = 80;
    public collisions: CollisionInfo;
    public wallInteractionGroups: InteractionGroups;
    public playerInput: Vector2 = new Vector2();

    constructor(wallInteractionGroups: InteractionGroups = 0) {
        this.collisions = {
            above: false,
            below: false,
            grounded: false,
            left: false,
            right: false,
            wall: false,
            head: false,
            climbingSlope: false,
            descendingSlope: false,
            slidingDownMaxSlope: false,
            slopeAngle: 0,
            slopeAngleOld: 0,
            slopeNormal: new Vector2(0, 0),
            moveAmountOld: new Vector2(0, 0),
            faceDir: 1,
            fallingThroughPlatform: false,
            reset: function () {
                this.above = this.below = false;
                this.left = this.right = false;
                this.head = false;
                this.wall = false;
                this.climbingSlope = false;
                this.descendingSlope = false;
                this.slidingDownMaxSlope = false;
                this.slopeNormal = new Vector2(0, 0);
                this.slopeAngleOld = this.slopeAngle;
                this.slopeAngle = 0;
            }
        };

        this.wallInteractionGroups = wallInteractionGroups;
    }

    public move(
        moveAmount: Vector2,
        input: Vector2 = new Vector2(0, 0),
        standingOnPlatform: boolean = false,
        controller: RaycastController,
        world: World
    ): Vector2 {
        controller.updateRaycastOrigins();

        this.collisions.reset();
        this.collisions.moveAmountOld = moveAmount.clone();
        this.playerInput = input;

        if (moveAmount.y < 0) {
            this.descendSlope(moveAmount, controller);
        }

        if (moveAmount.x !== 0) {
            this.collisions.faceDir = Math.sign(moveAmount.x);
        }

        this.horizontalCollisions(moveAmount, controller, world);
        if (moveAmount.y !== 0) {
            this.verticalCollisions(moveAmount, controller, world);
        }

        controller.translate(moveAmount);

        if (standingOnPlatform) {
            this.collisions.below = true;
        }

        return moveAmount;
    }

    private horizontalCollisions(moveAmount: Vector2, controller: RaycastController, world: World): void {
        const directionX = this.collisions.faceDir;
        let rayLength = Math.abs(moveAmount.x) + controller.skinWidth;

        if (Math.abs(moveAmount.x) < controller.skinWidth) {
            rayLength = 2 * controller.skinWidth;
        }

        // 헤드 레이 검사 (원래 코드의 headRay 부분)
        const headRayOrigin = (directionX === -1) ? controller.raycastOrigins.topLeft : controller.raycastOrigins.topRight;
        const headRayHit = this.raycast(headRayOrigin, {x: directionX, y: 0}, rayLength * 2, controller.collisionMask);

        if (headRayHit) {
            this.collisions.head = true;
        }

        for (let i = 0; i < controller.horizontalRayCount; i++) {
            let rayOrigin = (directionX === -1) ? controller.raycastOrigins.bottomLeft : controller.raycastOrigins.bottomRight;
            rayOrigin = {
                x: rayOrigin.x,
                y: rayOrigin.y + (controller.horizontalRaySpacing * i)
            };

            const hit = this.raycast(rayOrigin, {x: directionX, y: 0}, rayLength, controller.collisionMask);

            if (hit) {
                if (hit.distance === 0) {
                    continue;
                }

                const slopeAngle = this.vector2Angle(hit.normal, {x: 0, y: 1});

                if (i === 0 && slopeAngle <= this.maxSlopeAngle) {
                    if (this.collisions.descendingSlope) {
                        this.collisions.descendingSlope = false;
                        moveAmount = {...this.collisions.moveAmountOld};
                    }

                    let distanceToSlopeStart = 0;
                    if (slopeAngle !== this.collisions.slopeAngleOld) {
                        distanceToSlopeStart = hit.distance - controller.skinWidth;
                        moveAmount.x -= distanceToSlopeStart * directionX;
                    }

                    this.climbSlope(moveAmount, slopeAngle, hit.normal);
                    moveAmount.x += distanceToSlopeStart * directionX;
                }

                if (!this.collisions.climbingSlope || slopeAngle > this.maxSlopeAngle) {
                    moveAmount.x = (hit.distance - controller.skinWidth) * directionX;
                    rayLength = hit.distance;

                    if (this.collisions.climbingSlope) {
                        moveAmount.y = Math.tan(this.collisions.slopeAngle * Math.PI / 180) * Math.abs(moveAmount.x);
                    }

                    this.collisions.left = directionX === -1;
                    this.collisions.right = directionX === 1;
                    if (this.layerInMask(hit.collider.gameObject.layer, this.wallMask)) {
                        this.collisions.wall = true;
                    }
                }
            }
        }

        if (!(this.collisions.left || this.collisions.right)) {
            this.collisions.head = false;
        }
    }

    private verticalCollisions(moveAmount: Vector2, controller: RaycastController, world: World): void {
        const directionY = Math.sign(moveAmount.y);
        const rayLength = Math.abs(moveAmount.y) + controller.skinWidth;

        this.collisions.grounded = false;
        if (directionY === -1) {
            for (let i = 0; i < controller.verticalRayCount; i++) {
                let groundedRayOrigin = controller.raycastOrigins.bottomLeft.clone();
                groundedRayOrigin.add({x: controller.verticalRaySpacing * i + moveAmount.x, y: 0});
                const groundedHits = this.raycastAll(groundedRayOrigin, {x: 0, y: -1}, 0.2, controller.collisionMask);

                if (groundedHits.length > 0) {
                    this.collisions.grounded = true;
                }
            }
        }

        for (let i = 0; i < controller.verticalRayCount; i++) {
            let rayOrigin = (directionY === -1) ? controller.raycastOrigins.bottomLeft : controller.raycastOrigins.topLeft;
            rayOrigin = {
                x: rayOrigin.x + (controller.verticalRaySpacing * i + moveAmount.x),
                y: rayOrigin.y
            };
            const hits = this.raycastAll(rayOrigin, {x: 0, y: directionY}, rayLength, controller.collisionMask);

            for (const hit of hits) {
                if (hit) {
                    if (hit.collider.gameObject.layer === this.layerNameToId("Platform")) {
                        if (directionY === 1 || hit.distance === 0) {
                            continue;
                        }

                        if (this.collisions.fallingThroughPlatform) {
                            continue;
                        }

                        if (this.playerInput.y === -1) {
                            this.collisions.fallingThroughPlatform = true;
                            this.invoke("resetFallingThroughPlatform", 0.5);
                            continue;
                        }
                    }

                    moveAmount.y = (hit.distance - controller.skinWidth) * directionY;
                    rayLength = hit.distance;

                    if (this.collisions.climbingSlope) {
                        moveAmount.x = moveAmount.y / Math.tan(this.collisions.slopeAngle * Math.PI / 180) * Math.sign(moveAmount.x);
                    }

                    this.collisions.below = directionY === -1;
                    this.collisions.above = directionY === 1;
                }
            }
        }

        if (this.collisions.climbingSlope) {
            const directionX = Math.sign(moveAmount.x);
            rayLength = Math.abs(moveAmount.x) + controller.skinWidth;
            const rayOrigin = {
                x: ((directionX === -1) ? controller.raycastOrigins.bottomLeft.x : controller.raycastOrigins.bottomRight.x),
                y: ((directionX === -1) ? controller.raycastOrigins.bottomLeft.y : controller.raycastOrigins.bottomRight.y) + moveAmount.y
            };
            const hit = this.raycast(rayOrigin, {x: directionX, y: 0}, rayLength, controller.collisionMask);

            if (hit) {
                const slopeAngle = this.vector2Angle(hit.normal, {x: 0, y: 1});
                if (slopeAngle !== this.collisions.slopeAngle) {
                    moveAmount.x = (hit.distance - controller.skinWidth) * directionX;
                    this.collisions.slopeAngle = slopeAngle;
                    this.collisions.slopeNormal = hit.normal;
                }
            }
        }
    }

    private climbSlope(moveAmount: Vector2, slopeAngle: number, slopeNormal: Vector2): void {
        const moveDistance = Math.abs(moveAmount.x);
        const climbMoveAmountY = Math.sin(slopeAngle * Math.PI / 180) * moveDistance;

        if (moveAmount.y <= climbMoveAmountY) {
            moveAmount.y = climbMoveAmountY;
            moveAmount.x = Math.cos(slopeAngle * Math.PI / 180) * moveDistance * Math.sign(moveAmount.x);
            this.collisions.below = true;
            this.collisions.climbingSlope = true;
            this.collisions.slopeAngle = slopeAngle;
            this.collisions.slopeNormal = slopeNormal;
        }
    }

    private descendSlope(moveAmount: Vector2, controller: RaycastControllerParams): void {
        const maxSlopeHitLeft = this.raycast(
            controller.raycastOrigins.bottomLeft,
            {x: 0, y: -1},
            Math.abs(moveAmount.y) + controller.skinWidth,
            controller.collisionMask
        );

        const maxSlopeHitRight = this.raycast(
            controller.raycastOrigins.bottomRight,
            {x: 0, y: -1},
            Math.abs(moveAmount.y) + controller.skinWidth,
            controller.collisionMask
        );

        if ((maxSlopeHitLeft && !maxSlopeHitRight) || (!maxSlopeHitLeft && maxSlopeHitRight)) {
            if (maxSlopeHitLeft) this.slideDownMaxSlope(maxSlopeHitLeft, moveAmount);
            if (maxSlopeHitRight) this.slideDownMaxSlope(maxSlopeHitRight, moveAmount);
        }

        if (!this.collisions.slidingDownMaxSlope) {
            const directionX = Math.sign(moveAmount.x);
            const rayOrigin = (directionX === -1) ? controller.raycastOrigins.bottomRight : controller.raycastOrigins.bottomLeft;
            const hit = this.raycast(rayOrigin, {x: 0, y: -1}, Infinity, controller.collisionMask);

            if (hit) {
                const slopeAngle = this.vector2Angle(hit.normal, {x: 0, y: 1});
                if (slopeAngle !== 0 && slopeAngle <= this.maxSlopeAngle) {
                    if (Math.sign(hit.normal.x) === directionX) {
                        if (hit.distance - controller.skinWidth <= Math.tan(slopeAngle * Math.PI / 180) * Math.abs(moveAmount.x)) {
                            const moveDistance = Math.abs(moveAmount.x);
                            const descendMoveAmountY = Math.sin(slopeAngle * Math.PI / 180) * moveDistance;
                            moveAmount.x = Math.cos(slopeAngle * Math.PI / 180) * moveDistance * Math.sign(moveAmount.x);
                            moveAmount.y -= descendMoveAmountY;

                            this.collisions.slopeAngle = slopeAngle;
                            this.collisions.descendingSlope = true;
                            this.collisions.below = true;
                            this.collisions.slopeNormal = hit.normal;
                        }
                    }
                }
            }
        }
    }

    private slideDownMaxSlope(hit: RaycastHit2D, moveAmount: Vector2): void {
        if (hit) {
            const slopeAngle = this.vector2Angle(hit.normal, {x: 0, y: 1});
            if (slopeAngle > this.maxSlopeAngle) {
                moveAmount.x = Math.sign(hit.normal.x) * (Math.abs(moveAmount.y) - hit.distance) / Math.tan(slopeAngle * Math.PI / 180);

                this.collisions.slopeAngle = slopeAngle;
                this.collisions.slidingDownMaxSlope = true;
                this.collisions.slopeNormal = hit.normal;
            }
        }
    }

    private resetFallingThroughPlatform(): void {
        this.collisions.fallingThroughPlatform = false;
    }
}