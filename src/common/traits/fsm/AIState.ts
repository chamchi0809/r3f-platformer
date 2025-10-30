import type {Entity, World} from "koota";

export type AwaitedStateTick = (world: World, owner: Entity) => Promise<void>
export type StateTick = (world: World, owner: Entity) => void;

export default class AIState {
    private owner: Entity;
    private onEnter: AwaitedStateTick | undefined;
    private onUpdate: StateTick | undefined
    private onExit: AwaitedStateTick | undefined;

    private status: 'idle' | 'entering' | 'updating' | 'exiting' = 'idle';

    constructor(owner: Entity) {
        this.owner = owner;
    }

    whenEnter(tick: AwaitedStateTick) {
        this.onEnter = tick;
    }

    whenUpdate(tick: StateTick) {
        this.onUpdate = tick;
    }

    whenExit(tick: AwaitedStateTick) {
        this.onExit = tick;
    }

    private async enter(world: World) {
        if (this.status === "idle") {
            this.status = "entering";
            if (this.onEnter) {
                await this.onEnter(world, this.owner);
            }
            this.status = "updating";
        }
    }

    private update(world: World) {
        if (this.status === "updating") {
            this.onUpdate?.(world, this.owner);
        }
    }

    private async exit(world: World) {
        if (this.status === "updating") {
            this.status = "exiting";
            await this.onExit?.(world, this.owner);
            this.status = "idle";
        }
    }
}