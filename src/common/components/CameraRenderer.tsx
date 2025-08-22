import {CameraControls, OrthographicCamera} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {useMemo} from "react";
import type {Entity} from "koota";
import {useQueryFirst} from "koota/react";
import {IsCamera} from "@/common/traits/IsCamera.ts";
import {useRefInjector} from "@/common/hooks/useRefInjector.ts";

const CameraView = (
    {
        entity,
        size = 10,
    }: {
        entity: Entity;
        size?: number;
    }) => {

    const {aspect} = useThree(state => state.viewport);
    const frustum = useMemo(() => {
        const height = size * 2;
        const width = height * aspect;

        return {
            top: height / 2,
            bottom: -height / 2,
            left: -width / 2,
            right: width / 2,
        }
    }, [aspect, size]);

    const injectRef = useRefInjector(entity);

    return <OrthographicCamera
        ref={injectRef}
        manual
        makeDefault
        {...frustum}
        position={[0, 0, 10]}
    >
        <CameraControls/>
    </OrthographicCamera>
}

export default function CameraRenderer(
    {
        size = 10,
    }: {
        size?: number;
    }
) {
    const camera = useQueryFirst(IsCamera);
    return camera && <CameraView entity={camera} size={size}/>
}