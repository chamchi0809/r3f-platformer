import { trait } from "koota";
import type { Collider, World } from "@dimforge/rapier2d";

export const InteractableRef = trait(() => null! as Interactable);

export type InteractionType = "talk" | "battle";

export class Interactable {
  world: World;
  collider: Collider;
  type: InteractionType;

  constructor(collider: Collider, world: World, type: InteractionType) {
    this.world = world;
    this.collider = collider;
    this.type = type;
  }

  isIntersecting(otherCollider: Collider) {
    return this.collider.intersectsShape(otherCollider.shape, otherCollider.translation(), otherCollider.rotation());
  }
}
