const rapierPromise = import('@dimforge/rapier2d');
import {type Vector2, type World} from "@dimforge/rapier2d";
import {createContext, type Dispatch, memo, type ReactNode, type SetStateAction, use, useEffect, useMemo, useRef, useState} from "react";

export type RapierTicker = (world: World) => void;
export type TickerMap = Record<number, RapierTicker>;

export type RapierContextType = {
    rapier: typeof import('@dimforge/rapier2d');
    world: World;
    setTickers: Dispatch<SetStateAction<TickerMap>>;
}

export const RapierContext = createContext<RapierContextType | undefined>(undefined)

export default memo(function Physics(
    {
        timeStep,
        gravity,
        children,
    }: {
        timeStep: number;
        gravity: Vector2;
        children?: ReactNode;
    }
) {
    const rapier = use(rapierPromise);
    const world = useMemo(() => new rapier.World(gravity), [rapier]);
    const ref = useRef<NodeJS.Timeout>(null);
        const [tickers, setTickers] = useState<TickerMap>({});

    // Physics loop
    useEffect(() => {

        if (ref.current) clearInterval(ref.current);

        ref.current = setInterval(() => {
            world.step();
            Object.values(tickers).forEach(ticker => ticker(world));
        }, timeStep * 1000);

        return () => {
            if (ref.current) clearInterval(ref.current);
        }
    }, [world, timeStep, tickers]);

    return <RapierContext value={{
        rapier,
        world,
        setTickers,
    }}>
        {children}
    </RapierContext>
})