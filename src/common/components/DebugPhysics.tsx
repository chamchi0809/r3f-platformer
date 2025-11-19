import { memo, useRef } from "react";
import useRapier from "@/common/hooks/physics/useRapier.ts";
import { BufferAttribute, BufferGeometry, LineSegments } from "three";
import { useFrame } from "@react-three/fiber";

export default memo(function DebugPhysics() {
  const { world } = useRapier();
  const ref = useRef<LineSegments>(null);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const buffers = world.debugRender();
    const vertices3D = new Float32Array(buffers.vertices.length * 3 / 2);
    for (let i = 0; i < buffers.vertices.length; i += 2) {
      const j = (i / 2) * 3;
      vertices3D[j] = buffers.vertices[i]; // x
      vertices3D[j + 1] = buffers.vertices[i + 1]; // y
      vertices3D[j + 2] = 5; // z
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(vertices3D, 3));
    geometry.setAttribute("color", new BufferAttribute(buffers.colors, 4));

    mesh.geometry.dispose();
    mesh.geometry = geometry;
  });

  return (
    <group>
      <lineSegments ref={ref} frustumCulled={false}>
        <lineBasicMaterial color={0xffffff} vertexColors />
        <bufferGeometry />
      </lineSegments>
    </group>
  );
});
