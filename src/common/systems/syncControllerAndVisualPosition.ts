import type {World} from "koota";
import {CharacterControllerRef} from "@/common/traits/CharacterControllerRef.ts";
import {CharacterVisualPosition} from "@/common/traits/CharacterVisualPosition.ts";

export const syncControllerAndVisualPosition = (world: World) => {
    world.query(CharacterControllerRef, CharacterVisualPosition).updateEach(([ctrl, pos]) => {
        const col = ctrl.col;
        const colPos = col.translation();
        pos.set(colPos.x, colPos.y - ctrl.controller.offset());
    });
}