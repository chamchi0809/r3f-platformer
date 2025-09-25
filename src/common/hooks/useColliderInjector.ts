import {useWorld} from "koota/react";
import {useCallback} from "react";
import {ThreeRef} from "@/common/traits/ThreeRef.ts";
import type {Entity} from "koota";
import * as THREE from "three";
import type {RapierCollider} from "@react-three/rapier";
import {ColliderRef} from "@/common/traits/ColliderRef.ts";

export const useColliderInjector = (entity: Entity) => {
    const world = useWorld();
    const injectRef = useCallback(
        <T extends RapierCollider>(component: T | null) => {
            if (!component) {
                return;
            }
            if (!world.has(entity)) return;
            entity.add(ColliderRef(component));
            return () => entity.remove(ColliderRef);
        },
        [entity]
    );

    return injectRef;
}