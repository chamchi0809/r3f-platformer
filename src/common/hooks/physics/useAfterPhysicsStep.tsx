import useRapier from "@/common/hooks/physics/useRapier.ts";
import type {World} from "@dimforge/rapier2d";
import {type DependencyList, useCallback, useEffect, useMemo} from "react";

let tickerId = 0;

export default function useAfterPhysicsStep(callback: (rapierWorld: World) => void, deps: DependencyList = []) {
    const {setTickers} = useRapier();
    const id = useMemo(() => tickerId++, []);
    const cb = useCallback(callback, deps);
    useEffect(() => {
        setTickers((tickers) => {
            return {
                ...tickers,
                [id]: cb
            };
        });

        return () => {
            setTickers((tickers) => {
                const newTickers = {...tickers};
                delete newTickers[id];
                return newTickers;
            });
        }
    }, [cb, setTickers, id]);
}