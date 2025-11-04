import type FSM from "@/common/traits/fsm/FSM.ts"

export type AwaitedStateTick = <TState extends string>(owner: FSM<TState>) => Promise<void>
export type StateTick = <TState extends string>(owner: FSM<TState>) => void

export default class AIState<TState extends string> {
  private owner: FSM<TState>

  private onEnter: AwaitedStateTick | undefined
  private onUpdate: StateTick | undefined
  private onExit: AwaitedStateTick | undefined

  private status: "idle" | "entering" | "updating" | "exiting" = "idle"

  constructor(owner: FSM<TState>) {
    this.owner = owner
  }

  withEnter(tick: AwaitedStateTick) {
    this.onEnter = tick
    return this
  }

  withUpdate(tick: StateTick) {
    this.onUpdate = tick
    return this
  }

  withExit(tick: AwaitedStateTick) {
    this.onExit = tick
    return this
  }

  private async enter() {
    this.status = "entering"
    await this.onEnter?.(this.owner)
    this.status = "updating"
  }

  private update() {
    if (this.status === "updating") {
      this.onUpdate?.(this.owner)
    }
  }

  private async exit() {
    this.status = "exiting"
    await this.onExit?.(this.owner)
    this.status = "idle"
  }

  async start() {
    await this.enter()
  }

  tick() {
    this.update()
  }

  async stop() {
    await this.exit()
  }

  async switchTo(nextState: AIState<TState>) {
    await this.exit()
    await nextState.enter()
  }
}
