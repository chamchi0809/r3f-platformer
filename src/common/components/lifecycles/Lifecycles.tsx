import Startup from "@/common/components/lifecycles/Startup.tsx";
import FrameLoop from "@/common/components/lifecycles/FrameLoop.tsx";
import KeyboardEvents from "@/common/components/lifecycles/KeyboardEvents.tsx";
import { KeyboardControls } from "@react-three/drei";
import { rhythmControlMap } from "@/common/defs/keyboardControlMap.ts";
import RhythmKeyboardEvents from "@/common/components/lifecycles/RhythmKeyboardEvents.tsx";
import PhysicsLoop from "@/common/components/lifecycles/PhysicsLoop.tsx";

/** Lifecycles <br/>
 * (runs koota systems) <br/>
 * (initialization, loops, and keyboard events)
 * */
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
