import { trait } from "koota";
import type { Collider, World } from "@dimforge/rapier2d";

export const InteractableRef = trait(() => null! as Interactable);

export class Interactable {
  world: World;
  sensor: Collider;

  constructor(collider: Collider, world: World) {
    this.world = world;
    this.sensor = collider;
  }

  get col() {
    return this.world.getCollider(this.sensor.handle);
  }

  isIntersecting(otherCollider: Collider) {
    const intersection = this.world.intersectionPair(this.col, this.world.getCollider(otherCollider.handle));
    return intersection;
  }
}
