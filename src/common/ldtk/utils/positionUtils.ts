export const pxToGridPosition = (px:[number, number], gridSize: number): [number, number] => {
    const gridX = (px[0] / gridSize);
    const gridY = (px[1] / gridSize);
    return [gridX, gridY];
}

export const layerPxToWorldPx = (px: [number, number], layerPxOffsets: [number, number], layerPxDimensions: [number, number]): [number, number] => {
    return [
        px[0] + layerPxOffsets[0],
        layerPxDimensions[1] - px[1] - layerPxOffsets[1],
    ]
}