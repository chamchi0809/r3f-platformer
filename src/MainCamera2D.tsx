import {CameraControls, OrthographicCamera} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {useMemo} from "react";

export default function MainCamera2D(
    {
        size = 10,
    }: {
        size?: number;
    }
) {

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

    return <OrthographicCamera manual makeDefault {...frustum} position={[0, 0, 10]}>
        <CameraControls/>
    </OrthographicCamera>
}