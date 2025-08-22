import {useWorld} from "koota/react";
import {useCallback} from "react";
import {Ref} from "@/common/traits/Ref.ts";
import type {Entity} from "koota";
import * as THREE from "three";

export const useRefInjector = (entity: Entity) => {
    const world = useWorld();
    const injectRef = useCallback(
        <T extends THREE.Object3D>(component: T | null) => {
            if (!component) {
                return;
            }
            if (!world.has(entity)) return;
            entity.add(Ref(component));
            return () => entity.remove(Ref);
        },
        [entity]
    );

    return injectRef;
}