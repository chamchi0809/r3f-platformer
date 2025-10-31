import {useWorld} from "koota/react";
import {useEffect} from "react";
import type {Entity} from "koota";
import {CharacterController, CharacterControllerRef} from "@/common/traits/CharacterControllerRef.ts";
import useRapier from "@/common/hooks/physics/useRapier.ts";
import type {Collider} from "@dimforge/rapier2d";

export const useCharacterControllerInjector = (
    entity: Entity,
    collider: Collider | undefined
) => {
    const world = useWorld();
    const {world: rapierWorld} = useRapier();

    useEffect(() => {
        if (!world.has(entity)) return;
        if (collider) {
            entity.add(CharacterControllerRef(new CharacterController(collider, rapierWorld)));
        }
        return () => {
            entity.get(CharacterControllerRef)?.cleanup();
            entity.remove(CharacterControllerRef);
        };
    }, [collider]);
}