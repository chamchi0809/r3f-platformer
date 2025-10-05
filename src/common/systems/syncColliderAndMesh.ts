import type {World} from "koota";
import {ColliderRef} from "@/common/traits/ColliderRef.ts";
import {ThreeRef} from "@/common/traits/ThreeRef.ts";
import {PPU} from "@/common/defs/ppu.ts";

export const syncColliderAndMesh = (world: World) => {
    world.query(ColliderRef, ThreeRef).updateEach(([colliderRef, threeRef]) => {
        const col = colliderRef.col;
        const obj = threeRef;

        if (!col || !obj) return;

        const pos = col.translation();
        const rot = col.rotation();

        obj.position.set(pos.x, pos.y - 0.01, pos.z);
        obj.quaternion.set(rot.x, rot.y, rot.z, rot.w);
    });
}