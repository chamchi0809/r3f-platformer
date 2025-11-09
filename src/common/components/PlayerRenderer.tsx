import { useQueryFirst } from "koota/react";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import type { Entity } from "koota";
import { CharacterStartPosition } from "@/common/traits/CharacterStartPosition.ts";
import { useThreeInjector } from "@/common/hooks/injection/useThreeInjector.ts";
import { useCharacterControllerInjector } from "@/common/hooks/injection/useCharacterControllerInjector.ts";
import { INTERACTION_GROUPS } from "@/common/defs/colGroup.ts";
import { useMaterialInjector } from "@/common/hooks/injection/useMaterialInjector.ts";
import useRapier from "@/common/hooks/physics/useRapier.ts";
import useCreateCollider from "@/common/hooks/physics/useCreateCollider.ts";
import { useUnmount } from "react-use";
import { AppearanceMode, RenderMode, VFXEmitter, VFXParticles } from "wawa-vfx";
import { MultiplyBlending } from "three";
import { useSpriteAnimInjector } from "@/common/hooks/injection/useSpriteAnimInjector.ts";

const PlayerView = ({ entity}: { entity: Entity }) => {
  const startPos = entity.get(CharacterStartPosition)!;

  const threeRef = useThreeInjector(entity);
  const materialRef = useMaterialInjector(entity);

  const { rapier } = useRapier();
  const collider = useCreateCollider({
    startPosition: startPos.clone(),
    colliderDesc: rapier.ColliderDesc.cuboid(0.4, 0.4)
      .setCollisionGroups(INTERACTION_GROUPS.WHITE)
      .setMass(1)
      .setRestitution(0)
      .setFriction(1),
  });
  useCharacterControllerInjector(entity, collider!);
  useSpriteAnimInjector(entity, {
    range: [3, 5],
    getPath: (index: number) => `./assets/img/dancing/hips${index}.png`,
    frameDuration: 0.05,
    loop: false,
  });

  return (
    <group ref={threeRef}>
      <group position-z={1}>
        <mesh>
          <planeGeometry args={[0.8, 0.8, 1]} />
          <meshLambertMaterial color="white" ref={materialRef} transparent />
        </mesh>
        <pointLight
          castShadow
          position-z={2}
          intensity={2}
          decay={0.5}
          distance={15}
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
          shadow-bias={0.005}
          shadow-normalBias={0.02}
        />
      </group>
      <group position-z={0.5}>
        <VFXParticles
          name="pulse"
          settings={{
            nbParticles: 100000,
            gravity: [0, 0, 0],
            // fade in end time, fade out start time
            fadeAlpha: [0.49, 0.51],
            fadeSize: [0.25, 1],
            intensity: 1,
            blendingMode: MultiplyBlending,
            appearance: AppearanceMode.Square,
            renderMode: RenderMode.Billboard,
            easeFunction: "easeLinear",
          }}
        />
        <VFXEmitter
          debug
          autoStart
          emitter="pulse"
          settings={{
            duration: 0.5,
            delay: 0,
            nbParticles: 1,
            spawnMode: "burst",
            loop: false,
            startPositionMin: [0, 0, 0],
            startPositionMax: [0, 0, 0],
            startRotationMin: [0, 0, 0],
            startRotationMax: [0, 0, 0],
            particlesLifetime: [1, 1],
            speed: [0, 0],
            directionMin: [-1, -1, -1],
            directionMax: [1, 1, 1],
            rotationSpeedMin: [0, 0, 0],
            rotationSpeedMax: [0, 0, 0],
            colorStart: ["#ffffff"],
            colorEnd: ["#ffffff"],
            size: [2.5, 2.5],
          }}
        />
      </group>
    </group>
  );
};

export default function PlayerRenderer() {
  const player = useQueryFirst(IsPlayer);

  useUnmount(() => {
    player?.destroy();
  });

  if (!player) {
    return <></>;
  }

  return <PlayerView entity={player} />;
}
