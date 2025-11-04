// get angle between two vectors in degrees
export function vector2Angle(a: { x: number, y: number }, b: { x: number, y: number }): number {
  const dot = a.x * b.x + a.y * b.y
  const magA = Math.sqrt(a.x * a.x + a.y * a.y)
  const magB = Math.sqrt(b.x * b.x + b.y * b.y)
  const cosTheta = dot / (magA * magB)
  const clamped = Math.max(-1, Math.min(1, cosTheta))
  return Math.acos(clamped) * (180 / Math.PI)
}

export const deg2rad = (deg: number) => deg * (Math.PI / 180)
