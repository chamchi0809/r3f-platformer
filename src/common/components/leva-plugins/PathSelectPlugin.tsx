import {Components, createPlugin, type LevaInputProps, useInputContext} from "leva/plugin";

const {Row, Label} = Components

type PathSelectSettings = { disabled?: boolean }
type PathSelectType = { path: string; }
type PathSelectInput = PathSelectType & PathSelectSettings

type PathSelectProps = LevaInputProps<PathSelectType, PathSelectSettings, string>

function PathSelect() {
    const props = useInputContext<PathSelectProps>()
    const {label, displayValue, onUpdate} = props
    return <Row input>
        <Label>{label}</Label>
        <button onClick={async () => {
            if (window.api) {
                const {data} = await window.api.openPublic("/assets")
                if (data.filePaths.length == 1) {
                    onUpdate(data.filePaths[0])
                }
            }
        }}>
            {displayValue || "Select Path"}
        </button>
    </Row>
}

const normalize = ({path, disabled}: PathSelectInput) => {
    return {value: {path}, settings: {disabled}}
}

const sanitize = (v: string): PathSelectType => {
    return {path: v};
}

const format = (v: PathSelectType) => {
    return v.path
};

const pathSelectPlugin = createPlugin({
    sanitize,
    format,
    component: PathSelect,
    normalize
})

export default pathSelectPlugin;