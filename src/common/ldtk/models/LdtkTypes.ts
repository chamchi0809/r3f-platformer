/**
 * This file is a JSON schema of files created by LDtk level editor (https://ldtk.io).
 *
 * This is the root of any Project JSON file. It contains:  - the project settings, - an
 * array of levels, - a group of definitions (that can probably be safely ignored for most
 * users).
 */
export interface Ldtk {
    __FORCED_REFS?: ForcedRefs;
    appBuildId: number;
    backupLimit: number;
    backupOnSave: boolean;
    backupRelPath?: null | string;
    bgColor: string;
    customCommands: LdtkCustomCommand[];
    defaultEntityHeight: number;
    defaultEntityWidth: number;
    defaultGridSize: number;
    defaultLevelBgColor: string;
    defaultLevelHeight?: number | null;
    defaultLevelWidth?: number | null;
    defaultPivotX: number;
    defaultPivotY: number;
    defs: Definitions;
    dummyWorldIid: string;
    exportLevelBg: boolean;
    exportPng?: boolean | null;
    exportTiled: boolean;
    externalLevels: boolean;
    flags: Flag[];
    identifierStyle: IdentifierStyle;
    iid: string;
    imageExportMode: ImageExportMode;
    jsonVersion: string;
    levelNamePattern: string;
    levels: Level[];
    minifyJson: boolean;
    nextUid: number;
    pngFilePattern?: null | string;
    simplifiedExport: boolean;
    toc: LdtkTableOfContentEntry[];
    tutorialDesc?: null | string;
    worldGridHeight?: number | null;
    worldGridWidth?: number | null;
    worldLayout?: WorldLayout | null;
    worlds: World[];

    [property: string]: any;
}

export interface ForcedRefs {
    AutoLayerRuleGroup?: AutoLayerRuleGroup;
    AutoRuleDef?: AutoLayerRuleDefinition;
    CustomCommand?: LdtkCustomCommand;
    Definitions?: Definitions;
    EntityDef?: EntityDefinition;
    EntityInstance?: EntityInstance;
    EntityReferenceInfos?: ReferenceToAnEntityInstance;
    EnumDef?: EnumDefinition;
    EnumDefValues?: EnumValueDefinition;
    EnumTagValue?: EnumTagValue;
    FieldDef?: FieldDefinition;
    FieldInstance?: FieldInstance;
    GridPoint?: GridPoint;
    IntGridValueDef?: IntGridValueDefinition;
    IntGridValueGroupDef?: IntGridValueGroupDefinition;
    IntGridValueInstance?: IntGridValueInstance;
    LayerDef?: LayerDefinition;
    LayerInstance?: LayerInstance;
    Level?: Level;
    LevelBgPosInfos?: LevelBackgroundPosition;
    NeighbourLevel?: NeighbourLevel;
    TableOfContentEntry?: LdtkTableOfContentEntry;
    Tile?: TileInstance;
    TileCustomMetadata?: TileCustomMetadata;
    TilesetDef?: TilesetDefinition;
    TilesetRect?: TilesetRectangle;
    TocInstanceData?: LdtkTocInstanceData;
    World?: World;

    [property: string]: any;
}

export interface AutoLayerRuleGroup {
    active: boolean;
    biomeRequirementMode: number;
    collapsed?: boolean | null;
    color?: null | string;
    icon?: TilesetRectangle | null;
    isOptional: boolean;
    name: string;
    requiredBiomeValues: string[];
    rules: AutoLayerRuleDefinition[];
    uid: number;
    usesWizard: boolean;
}

export interface TilesetRectangle {
    h: number;
    tilesetUid: number;
    w: number;
    x: number;
    y: number;
}

export interface AutoLayerRuleDefinition {
    active: boolean;
    alpha: number;
    breakOnMatch: boolean;
    chance: number;
    checker: Checker;
    flipX: boolean;
    flipY: boolean;
    invalidated: boolean;
    outOfBoundsValue?: number | null;
    pattern: number[];
    perlinActive: boolean;
    perlinOctaves: number;
    perlinScale: number;
    perlinSeed: number;
    pivotX: number;
    pivotY: number;
    size: number;
    tileIds?: number[] | null;
    tileMode: TileMode;
    tileRandomXMax: number;
    tileRandomXMin: number;
    tileRandomYMax: number;
    tileRandomYMin: number;
    tileRectsIds: Array<number[]>;
    tileXOffset: number;
    tileYOffset: number;
    uid: number;
    xModulo: number;
    xOffset: number;
    yModulo: number;
    yOffset: number;
}

export type Checker = "Horizontal" | "None" | "Vertical";
export type TileMode = "Single" | "Stamp";
export type When = "AfterLoad" | "AfterSave" | "BeforeSave" | "Manual";
export type AllowedRefs = "Any" | "OnlySame" | "OnlySpecificEntity" | "OnlyTags";
export type EditorDisplayMode =
    | "ArrayCountNoLabel"
    | "ArrayCountWithLabel"
    | "EntityTile"
    | "Hidden"
    | "LevelTile"
    | "NameAndValue"
    | "PointPath"
    | "PointPathLoop"
    | "PointStar"
    | "Points"
    | "RadiusGrid"
    | "RadiusPx"
    | "RefLinkBetweenCenters"
    | "RefLinkBetweenPivots"
    | "ValueOnly";
export type EditorDisplayPos = "Above" | "Beneath" | "Center";
export type EditorLinkStyle = "ArrowsLine" | "CurvedArrow" | "DashedLine" | "StraightArrow" | "ZigZag";
export type TextLanguageMode =
    | "LangC"
    | "LangHaxe"
    | "LangJS"
    | "LangJson"
    | "LangLog"
    | "LangLua"
    | "LangMarkdown"
    | "LangPython"
    | "LangRuby"
    | "LangXml";
export type LimitBehavior = "DiscardOldOnes" | "MoveLastOne" | "PreventAdding";
export type LimitScope = "PerLayer" | "PerLevel" | "PerWorld";
export type RenderMode = "Cross" | "Ellipse" | "Rectangle" | "Tile";
export type TileRenderMode =
    | "Cover"
    | "FitInside"
    | "FullSizeCropped"
    | "FullSizeUncropped"
    | "NineSlice"
    | "Repeat"
    | "Stretch";
export type Type = "AutoLayer" | "Entities" | "IntGrid" | "Tiles";
export type EmbedAtlas = "LdtkIcons";
export type BgPos = "Contain" | "Cover" | "CoverDirty" | "Repeat" | "Unscaled";
export type WorldLayout = "Free" | "GridVania" | "LinearHorizontal" | "LinearVertical";
export type Flag =
    | "DiscardPreCsvIntGrid"
    | "ExportOldTableOfContentData"
    | "ExportPreCsvIntGridFormat"
    | "IgnoreBackupSuggest"
    | "MultiWorlds"
    | "PrependIndexToLevelFileNames"
    | "UseMultilinesType";
export type IdentifierStyle = "Capitalize" | "Free" | "Lowercase" | "Uppercase";
export type ImageExportMode = "LayersAndLevels" | "None" | "OneImagePerLayer" | "OneImagePerLevel";

export interface LdtkCustomCommand {
    command: string;
    when: When;
}

export interface Definitions {
    entities: EntityDefinition[];
    enums: EnumDefinition[];
    externalEnums: EnumDefinition[];
    layers: LayerDefinition[];
    levelFields: FieldDefinition[];
    tilesets: TilesetDefinition[];
}

export interface EntityDefinition {
    allowOutOfBounds: boolean;
    color: string;
    doc?: null | string;
    exportToToc: boolean;
    fieldDefs: FieldDefinition[];
    fillOpacity: number;
    height: number;
    hollow: boolean;
    identifier: string;
    keepAspectRatio: boolean;
    limitBehavior: LimitBehavior;
    limitScope: LimitScope;
    lineOpacity: number;
    maxCount: number;
    maxHeight?: number | null;
    maxWidth?: number | null;
    minHeight?: number | null;
    minWidth?: number | null;
    nineSliceBorders: number[];
    pivotX: number;
    pivotY: number;
    renderMode: RenderMode;
    resizableX: boolean;
    resizableY: boolean;
    showName: boolean;
    tags: string[];
    tileId?: number | null;
    tileOpacity: number;
    tileRect?: TilesetRectangle | null;
    tileRenderMode: TileRenderMode;
    tilesetId?: number | null;
    uid: number;
    uiTileRect?: TilesetRectangle | null;
    width: number;
}

export interface FieldDefinition {
    __type: string;
    acceptFileTypes?: string[] | null;
    allowedRefs: AllowedRefs;
    allowedRefsEntityUid?: number | null;
    allowedRefTags: string[];
    allowOutOfLevelRef: boolean;
    arrayMaxLength?: number | null;
    arrayMinLength?: number | null;
    autoChainRef: boolean;
    canBeNull: boolean;
    defaultOverride?: any;
    doc?: null | string;
    editorAlwaysShow: boolean;
    editorCutLongValues: boolean;
    editorDisplayColor?: null | string;
    editorDisplayMode: EditorDisplayMode;
    editorDisplayPos: EditorDisplayPos;
    editorDisplayScale: number;
    editorLinkStyle: EditorLinkStyle;
    editorShowInWorld: boolean;
    editorTextPrefix?: null | string;
    editorTextSuffix?: null | string;
    exportToToc: boolean;
    identifier: string;
    isArray: boolean;
    max?: number | null;
    min?: number | null;
    regex?: null | string;
    searchable: boolean;
    symmetricalRef: boolean;
    textLanguageMode?: TextLanguageMode | null;
    tilesetUid?: number | null;
    type: string;
    uid: number;
    useForSmartColor: boolean;
}

export interface EnumDefinition {
    externalFileChecksum?: null | string;
    externalRelPath?: null | string;
    iconTilesetUid?: number | null;
    identifier: string;
    tags: string[];
    uid: number;
    values: EnumValueDefinition[];
}

export interface EnumValueDefinition {
    __tileSrcRect?: number[] | null;
    color: number;
    id: string;
    tileId?: number | null;
    tileRect?: TilesetRectangle | null;
}

export interface LayerDefinition {
    __type: string;
    autoRuleGroups: AutoLayerRuleGroup[];
    autoSourceLayerDefUid?: number | null;
    autoTilesetDefUid?: number | null;
    autoTilesKilledByOtherLayerUid?: number | null;
    biomeFieldUid?: number | null;
    canSelectWhenInactive: boolean;
    displayOpacity: number;
    doc?: null | string;
    excludedTags: string[];
    gridSize: number;
    guideGridHei: number;
    guideGridWid: number;
    hideFieldsWhenInactive: boolean;
    hideInList: boolean;
    identifier: string;
    inactiveOpacity: number;
    intGridValues: IntGridValueDefinition[];
    intGridValuesGroups: IntGridValueGroupDefinition[];
    parallaxFactorX: number;
    parallaxFactorY: number;
    parallaxScaling: boolean;
    pxOffsetX: number;
    pxOffsetY: number;
    renderInWorldView: boolean;
    requiredTags: string[];
    tilePivotX: number;
    tilePivotY: number;
    tilesetDefUid?: number | null;
    type: Type;
    uiColor?: null | string;
    uid: number;
    uiFilterTags: string[];
    useAsyncRender: boolean;
}

export interface IntGridValueDefinition {
    color: string;
    groupUid: number;
    identifier?: null | string;
    tile?: TilesetRectangle | null;
    value: number;
}

export interface IntGridValueGroupDefinition {
    color?: null | string;
    identifier?: null | string;
    uid: number;
}

export interface TilesetDefinition {
    __cHei: number;
    __cWid: number;
    cachedPixelData?: { [key: string]: any } | null;
    customData: TileCustomMetadata[];
    embedAtlas?: EmbedAtlas | null;
    enumTags: EnumTagValue[];
    identifier: string;
    padding: number;
    pxHei: number;
    pxWid: number;
    relPath?: null | string;
    savedSelections: { [key: string]: any }[];
    spacing: number;
    tags: string[];
    tagsSourceEnumUid?: number | null;
    tileGridSize: number;
    uid: number;
}

export interface TileCustomMetadata {
    data: string;
    tileId: number;
}

export interface EnumTagValue {
    enumValueId: string;
    tileIds: number[];
}

export interface EntityInstance {
    __grid: number[];
    __identifier: string;
    __pivot: number[];
    __smartColor: string;
    __tags: string[];
    __tile?: TilesetRectangle | null;
    __worldX?: number | null;
    __worldY?: number | null;
    defUid: number;
    fieldInstances: FieldInstance[];
    height: number;
    iid: string;
    px: number[];
    width: number;
}

export interface FieldInstance {
    __identifier: string;
    __tile?: TilesetRectangle | null;
    __type: string;
    __value: any;
    defUid: number;
    realEditorValues: any[];
}

export interface ReferenceToAnEntityInstance {
    entityIid: string;
    layerIid: string;
    levelIid: string;
    worldIid: string;
}

export interface GridPoint {
    cx: number;
    cy: number;
}

export interface IntGridValueInstance {
    coordId: number;
    v: number;
}

export type LayerInstanceType = "AutoLayer" | "Entities" | "IntGrid" | "Tiles";

export interface LayerInstance {
    __cHei: number;
    __cWid: number;
    __gridSize: number;
    __identifier: string;
    __opacity: number;
    __pxTotalOffsetX: number;
    __pxTotalOffsetY: number;
    __tilesetDefUid?: number | null;
    __tilesetRelPath?: null | string;
    __type: LayerInstanceType;
    autoLayerTiles: TileInstance[];
    entityInstances: EntityInstance[];
    gridTiles: TileInstance[];
    iid: string;
    intGrid?: IntGridValueInstance[] | null;
    intGridCsv: number[];
    layerDefUid: number;
    levelId: number;
    optionalRules: number[];
    overrideTilesetUid?: number | null;
    pxOffsetX: number;
    pxOffsetY: number;
    seed: number;
    visible: boolean;
}

export interface TileInstance {
    a: number;
    d: number[];
    f: number;
    px: number[];
    src: number[];
    t: number;
}

export interface Level {
    __bgColor: string;
    __bgPos?: LevelBackgroundPosition | null;
    __neighbours: NeighbourLevel[];
    __smartColor: string;
    bgColor?: null | string;
    bgPivotX: number;
    bgPivotY: number;
    bgPos?: BgPos | null;
    bgRelPath?: null | string;
    externalRelPath?: null | string;
    fieldInstances: FieldInstance[];
    identifier: string;
    iid: string;
    layerInstances?: LayerInstance[] | null;
    pxHei: number;
    pxWid: number;
    uid: number;
    useAutoIdentifier: boolean;
    worldDepth: number;
    worldX: number;
    worldY: number;
}

export interface LevelBackgroundPosition {
    cropRect: number[];
    scale: number[];
    topLeftPx: number[];
}

export interface NeighbourLevel {
    dir: string;
    levelIid: string;
    levelUid?: number | null;
}

export interface LdtkTableOfContentEntry {
    identifier: string;
    instances?: ReferenceToAnEntityInstance[];
    instancesData: LdtkTocInstanceData[];
}

export interface LdtkTocInstanceData {
    fields: any;
    heiPx: number;
    iids: ReferenceToAnEntityInstance;
    widPx: number;
    worldX: number;
    worldY: number;
}

export interface World {
    defaultLevelHeight: number;
    defaultLevelWidth: number;
    identifier: string;
    iid: string;
    levels: Level[];
    worldGridHeight: number;
    worldGridWidth: number;
    worldLayout: WorldLayout | null;
}