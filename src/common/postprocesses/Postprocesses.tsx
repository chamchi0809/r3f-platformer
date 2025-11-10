import { Bloom, EffectComposer, Noise, Sepia, Vignette } from "@react-three/postprocessing";
import { BlendFunction, VignetteTechnique } from "postprocessing";

export default function Postprocesses() {
  return (
    <EffectComposer multisampling={0} enabled={true}>
      <Sepia
        intensity={0.2}
        blendFunction={BlendFunction.NORMAL}
      />
      <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      <Noise opacity={0.07} />
      <Vignette technique={VignetteTechnique.DEFAULT} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
