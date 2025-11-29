import { world } from "@/common/world";
import { IsBattle } from "@/common/traits/IsBattle";
import { HealthBarViewRef } from "@/common/traits/HealthBarViewRef";
import { RootRef } from "@/common/traits/RootRef";
import { MeshRef } from "@/common/traits/MeshRef";
import { Box3, Vector3 } from "three";

const GAP = 0.5 as const;

export const syncHealthBarView = () => {
  const opponent = world.queryFirst(IsBattle);

  if (!opponent) return;

  const opponentObj = opponent.get(RootRef);
  const opponentMesh = opponent.get(MeshRef);

  if (!opponentObj || !opponentMesh) return;

  world.query(HealthBarViewRef).updateEach(([object]) => {
    const { x, y, z } = opponentObj.position;
    const size = new Vector3();
    new Box3().setFromObject(opponentMesh).getSize(size);
    object.position.set(x, y + size.y / 2 + GAP, z);
  });
};
