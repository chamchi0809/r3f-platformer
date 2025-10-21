import {createChamQuery} from "@/common/queries/ChamQuery.ts";
import {TextureLoader} from "three";
import * as THREE from "three";
import {getSafePath} from "@/common/utils/electronUtils.ts";

export default createChamQuery({
    baseQueryKey: ["ldtk", "tilesetImage"],
    options: ({ldtkDir, relPath}: { ldtkDir: string; relPath: string; }) => ({
        queryFn: async () => {
            const image = new Image();
            image.src = getSafePath(ldtkDir + relPath);
            await new Promise((resolve, reject) => {
                image.onload = () => resolve(true);
                image.onerror = () => reject(new Error(`Failed to load image: ${ldtkDir + relPath}`));
            });
            return image;
        },
    }),
})