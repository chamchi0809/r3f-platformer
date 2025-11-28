import { IsBattle } from "@/common/traits/IsBattle";
import { IsInteracting } from "@/common/traits/IsInteracting";
import type { World } from "koota";

export const pressedRunawayInput = (world: World) => {
  world.query(IsInteracting, IsBattle).updateEach((_, entity) => {
    entity.remove(IsInteracting);
    entity.remove(IsBattle);
  });
};
