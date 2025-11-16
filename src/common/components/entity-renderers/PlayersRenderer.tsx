import { useQuery } from "koota/react";
import { IsPlayer } from "@/common/traits/IsPlayer.ts";
import type { Entity } from "koota";
import { useThreeInjector } from "@/common/hooks/injection/useThreeInjector.ts";
import { useMaterialInjector } from "@/common/hooks/injection/useMaterialInjector.ts";
import { useUnmount } from "react-use";

const PlayerView = ({ entity}: { entity: Entity }) => {
  const threeRef = useThreeInjector(entity);
  const materialRef = useMaterialInjector(entity);

  return (
    <group ref={threeRef}>
      <group position-z={1}>
        <mesh>
          <planeGeometry args={[1.6, 2, 1]} />
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
    </group>
  );
};

export default function PlayersRenderer() {
  const players = useQuery(IsPlayer);

  useUnmount(() => {
    players.forEach(p => p.destroy());
  });

  return players.map(player => <PlayerView entity={player} />);
}
