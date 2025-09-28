import {useWorld} from "koota/react";
import {useCallback} from "react";
import type {Entity} from "koota";
import {type RapierCollider, useRapier} from "@react-three/rapier";
import {KinematicController, KinematicControllerRef} from "@/common/traits/KinematicControllerRef.ts";

export const useKinematicControllerInjector = (entity: Entity) => {
    const world = useWorld();
    const {world: rapierWorld} = useRapier();
    const injectRef = useCallback(
        <T extends RapierCollider>(component: T | null) => {
            if (!component) {
                return;
            }
            if (!world.has(entity)) return;
            entity.add(KinematicControllerRef(new KinematicController(component, rapierWorld)));
            return () => entity.remove(KinematicControllerRef);
        },
        [entity]
    );

    return injectRef;
}