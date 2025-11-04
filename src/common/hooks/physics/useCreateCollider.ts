import type { Collider, ColliderDesc } from '@dimforge/rapier2d'
import type { Vector2 } from 'three'
import useRapier from '@/common/hooks/physics/useRapier.ts'
import { useEffect, useState } from 'react'

export interface ColliderDefinition {
  startPosition?: Vector2
  colliderDesc: ColliderDesc
  enabled?: boolean
}

export default function useCreateCollider(
  {
    startPosition,
    colliderDesc,
    enabled = true,
  }: ColliderDefinition,
) {
  const { world } = useRapier()
  const [collider, setCollider] = useState<Collider | undefined>(undefined)

  useEffect(() => {
    const col = enabled ? world.createCollider(colliderDesc) : undefined
    col?.setTranslation(startPosition ?? { x: 0, y: 0 })
    setCollider(col)

    return () => {
      if (col) {
        world.removeCollider(col, true)
      }
    }
  }, [enabled])

  return collider
}
