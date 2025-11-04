import { useControls } from 'leva'
import { Html } from '@react-three/drei'
import pathSelectPlugin from '@/common/components/leva-plugins/PathSelectPlugin.tsx'
import { useAsync } from 'react-use'
import type { Ldtk } from '@/common/ldtk/models/LdtkTypes.ts'

export default function TilesetEditor() {
  const { ldtkPath } = useControls({
    ldtkPath: pathSelectPlugin({ path: '', disabled: false }),
  })

  const { value: ldtk } = useAsync(async () => {
    if (window.api && ldtkPath.path && ldtkPath.path.endsWith('.ldtk')) {
      const { data } = await window.api.readAbs(ldtkPath.path)
      return JSON.parse(data) as Ldtk
    }
  }, [ldtkPath.path])

  useControls({
    tilesetId: {
      options: ldtk ? ldtk.defs.tilesets.map(t => t.identifier) : [],
      disabled: !ldtk,
      value: ldtk ? ldtk.defs.tilesets[0].identifier : '',
    },
  }, [ldtk])

  return (
    <>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Html>
        {ldtkPath.path}
      </Html>
    </>
  )
}
