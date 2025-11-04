import { createChamQuery } from '@/common/queries/ChamQuery.ts'
import tilesetImageQuery from '@/common/ldtk/queries/tilesetImageQuery.ts'
import { chunk } from 'es-toolkit'

export default createChamQuery({
  baseQueryKey: ['ldtk', 'tilesetPixels'],
  options: ({ ldtkDir, relPath, src, tileSize}: { ldtkDir: string, relPath: string, src: [number, number], tileSize: number }) => ({
    queryFn: async () => {
      const image = await tilesetImageQuery.fetch({
        ldtkDir,
        relPath,
      })
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx && image) {
        ctx.drawImage(image, 0, 0)
        return chunk(Array.from(ctx.getImageData(src[0], src[1], tileSize, tileSize).data), 4)
      }
      return []
    },
  }),
})
