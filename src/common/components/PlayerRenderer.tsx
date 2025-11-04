import { useQueryFirst } from "koota/react"
import { IsPlayer } from "@/common/traits/IsPlayer.ts"
import type { Entity } from "koota"
import { CharacterStartPosition } from "@/common/traits/CharacterStartPosition.ts"
import { useThreeInjector } from "@/common/hooks/injection/useThreeInjector.ts"
import { useCharacterControllerInjector } from "@/common/hooks/injection/useCharacterControllerInjector.ts"
import { INTERACTION_GROUPS } from "@/common/defs/colGroup.ts"
import { useMaterialInjector } from "@/common/hooks/injection/useMaterialInjector.ts"
import useRapier from "@/common/hooks/physics/useRapier.ts"
import useCreateCollider from "@/common/hooks/physics/useCreateCollider.ts"
import { useUnmount } from "react-use"

const PlayerView = ({ entity}: { entity: Entity }) => {
  const startPos = entity.get(CharacterStartPosition)!

  const threeRef = useThreeInjector(entity)
  const materialRef = useMaterialInjector(entity)

  const { rapier } = useRapier()
  const collider = useCreateCollider({
    startPosition: startPos.clone(),
    colliderDesc: rapier.ColliderDesc.cuboid(0.4, 0.4)
      .setCollisionGroups(INTERACTION_GROUPS.WHITE)
      .setMass(1)
      .setRestitution(0)
      .setFriction(1),
  })
  useCharacterControllerInjector(entity, collider!)

  return (
    <group ref={threeRef}>
      <mesh>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshLambertMaterial color="white" ref={materialRef} />
      </mesh>
      <pointLight castShadow position-z={2} intensity={2} decay={0.5} distance={15} shadow-mapSize-width={256} shadow-mapSize-height={256} shadow-bias={0.005} shadow-normalBias={0.02} />
    </group>
  )
}

export default function PlayerRenderer() {
  const player = useQueryFirst(IsPlayer)

  useUnmount(() => {
    player?.destroy()
  })

  if (!player) {
    return <></>
  }

  return <PlayerView entity={player} />
}
