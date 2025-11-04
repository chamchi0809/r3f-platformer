import AIState from "@/common/traits/fsm/AIState.ts";
import Timing from "@/common/utils/timingUtils.ts";
import { trait } from "koota";
import { world } from "@/common/world.ts";

export default class FSM<TState extends string> {
  private states: Map<TState, AIState<TState>> = new Map();

  public constructor() {
  }

  public withState(stateName: TState, stateBuilder: (state: AIState<TState>) => AIState<TState>): this {
    this.states.set(stateName, stateBuilder(new AIState<TState>(this)));
    return this;
  }

  public withDefault(stateName: TState): this {
    const state = this.states.get(stateName);
    if (state) {
      state.start();
    }
    return this;
  }

  public getState(stateName: TState): AIState<TState> | undefined {
    return this.states.get(stateName);
  }

  public async switchState(fromState: TState, toState: TState) {
    const from = this.states.get(fromState);
    const to = this.states.get(toState);
    if (from && to) {
      await from.stop();
      await to.start();
    }
  }

  public tick() {
    for (const state of this.states.values()) {
      state.tick();
    }
  }
}

export const FSMTrait = trait(() => null! as FSM<string>);

// example usage:
FSMTrait(
  new FSM<"idle" | "running">()
    .withState("idle", idle => idle
      .withEnter(async () => {
        await Timing.delay(1000);
      }),
    )
    .withState("running", running => running
      .withEnter(async () => {
        console.log("Entered running state");
      })
      .withUpdate(() => {
        console.log("Updating running state");
      })
      .withExit(async () => {
        console.log("Exiting running state");
      }),
    )
    .withDefault("idle"),
);

world.query(FSMTrait).updateEach(([fsm]) => {
  fsm.tick();
});
