import Startup from "@/common/lifecycles/Startup.tsx";
import FrameLoop from "@/common/lifecycles/FrameLoop.tsx";
import KeyboardEvents from "@/common/lifecycles/KeyboardEvents.tsx";
import { KeyboardControls } from "@react-three/drei";
import { rhythmControlMap } from "@/common/defs/keyboardControlMap.ts";
import RhythmKeyboardEvents from "@/common/lifecycles/RhythmKeyboardEvents.tsx";
import PhysicsLoop from "@/common/lifecycles/PhysicsLoop.tsx";

export default function Lifecycles() {
  return (
    <>
      <Startup />
      <FrameLoop />
      <KeyboardEvents />
      <KeyboardControls map={rhythmControlMap}>
        <RhythmKeyboardEvents />
      </KeyboardControls>
      <PhysicsLoop />
    </>
  );
}
