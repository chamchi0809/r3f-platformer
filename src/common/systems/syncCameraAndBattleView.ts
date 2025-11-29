import { BattleViewRef } from "@/common/traits/BattleViewRef";
import { IsCamera } from "@/common/traits/IsCamera";
import { RootRef } from "@/common/traits/RootRef";
import { world } from "@/common/world";

export const syncCameraAndBattleView = () => {
  const camera = world.queryFirst(IsCamera);

  if (camera) {
    const cameraObj = camera.get(RootRef);

    if (cameraObj) {
      world.query(BattleViewRef).updateEach(([object]) => {
        object.position.set(cameraObj.position.x, cameraObj.position.y, object.position.z);
      });
    }
  }
};
