import {useWorld} from "koota/react";
import {useCallback} from "react";
import type {RapierCollider} from "@react-three/rapier";
import {ColliderRef} from "@/common/traits/ColliderRef.ts";
import type {Entity} from "koota";
import {RaycastController, RaycastControllerRef} from "@/common/traits/RaycastControllerRef.ts";

export const useRaycastControllerInjector = (entity: Entity) => {
    const world = useWorld();
    const injectRef = useCallback(
        <T extends RapierCollider>(component: T | null) => {
            if (!component) {
                return;
            }
            if (!world.has(entity)) return;
            entity.add(RaycastControllerRef(new RaycastController(component)));
            return () => entity.remove(ColliderRef);
        },
        [entity]
    );

    return injectRef;
}