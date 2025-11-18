import { trait } from "koota";
import type { Collider, World } from "@dimforge/rapier2d";

export const InteractableRef = trait(() => null! as Interactable);

export class Interactable {
  world: World;
  collider: Collider;

  constructor(collider: Collider, world: World) {
    this.world = world;
    this.collider = collider;
  }

  isIntersecting(otherCollider: Collider) {
    return this.collider.intersectsShape(otherCollider.shape, otherCollider.translation(), otherCollider.rotation());
  }
}
