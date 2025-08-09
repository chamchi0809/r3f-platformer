import {CameraControls, OrthographicCamera, type OrthographicCameraProps} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {useEffect, useLayoutEffect, useMemo, useRef} from "react";

export default function MainCamera2D(
    {
        size = 10,
    }: {
        size?: number;
    }
) {

    const {aspect} = useThree(state => state.viewport);
    const camera = useThree(state => state.camera);
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

    useLayoutEffect(() => {
        if (camera) {
            const orthographicCamera = camera as OrthographicCameraProps;
            orthographicCamera.left = frustum.left;
            orthographicCamera.right = frustum.right;
            orthographicCamera.top = frustum.top;
            orthographicCamera.bottom = frustum.bottom;
            camera.updateProjectionMatrix();
        }
    }, [frustum, camera]);

    return <OrthographicCamera makeDefault {...frustum} position={[0, 0, 10]}>
        <CameraControls/>
    </OrthographicCamera>
}