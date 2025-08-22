import {useActions} from "koota/react";
import {actions} from "@/common/actions.ts";
import {useEffect} from "react";

export default function Startup() {
    const {
        spawnCamera,
    } = useActions(actions);

    useEffect(() => {
        spawnCamera();
    }, []);

    return <></>
}