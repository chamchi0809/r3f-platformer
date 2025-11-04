import type { World } from 'koota'
import { IsCamera } from '@/common/traits/IsCamera.ts'
import { ThreeRef } from '@/common/traits/ThreeRef.ts'
import { IsPlayer } from '@/common/traits/IsPlayer.ts'
import { CharacterControllerRef } from '@/common/traits/CharacterControllerRef.ts'
import * as THREE from 'three'

export const updateCamPos = (world: World, delta: number) => {
  world.query(IsCamera, ThreeRef).updateEach(([, camera]) => {
    world.query(IsPlayer, CharacterControllerRef).updateEach(([, ctrl]) => {
      const cam = camera as THREE.Camera
      const translation = ctrl.col.translation()

      // Snap camera position to pixel grid on both axes
      cam.position.lerp(new THREE.Vector3(translation.x, translation.y, 10), delta * 5)
    })
  })
}
