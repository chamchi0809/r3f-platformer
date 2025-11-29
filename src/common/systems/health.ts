import { HealthPoint } from "@/common/traits/HealthPoint";
import { IsBattle } from "@/common/traits/IsBattle";
import { clamp } from "es-toolkit";
import type { World } from "koota";
import { IsInteracting } from "../traits/IsInteracting";

export class HealthSystem {
  private _world: World;
  public MAX_HEALTH = 100 as const;

  public constructor(world: World) {
    this._world = world;
  }

  public static from(world: World) {
    return new HealthSystem(world);
  }

  public init() {
    this._world.query(IsBattle, HealthPoint).updateEach(([healthPoint]) => {
      healthPoint.health = this.MAX_HEALTH;
    });
  }

  public damage(value: number) {
    this._world.query(IsBattle, HealthPoint).updateEach(([healthPoint], entity) => {
      healthPoint.health = clamp(healthPoint.health - value, 0, this.MAX_HEALTH);

      if (healthPoint.health <= 0) {
        entity.remove(IsInteracting);
        entity.remove(IsBattle);
      }
    });
  }

  public heal(value: number) {
    this._world.query(IsBattle, HealthPoint).updateEach(([healthPoint]) => {
      healthPoint.health = clamp(healthPoint.health + value, 0, this.MAX_HEALTH);
    });
  }
}
