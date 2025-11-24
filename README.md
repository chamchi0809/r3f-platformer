# R3F Platformer

A 2D platformer game built with React Three Fiber (R3F), featuring an Entity Component System (ECS) architecture, physics simulation, and rhythm-based gameplay mechanics. The game runs as both a web application and an Electron desktop app.

## 🎮 Overview

This project is a pixel-art platformer that combines traditional platforming mechanics with rhythm game elements. Built using modern web technologies and 3D rendering in a 2D context, it showcases advanced game development patterns in React.

## 🏗️ Architecture

### Core Technologies

- **React 19** - UI framework
- **React Three Fiber (R3F)** - React renderer for Three.js
- **Three.js** - 3D graphics library (used for 2D rendering)
- **Koota** - Entity Component System (ECS) for game logic
- **Rapier2D** - Physics engine (WASM-based)
- **Electron** - Desktop application wrapper
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server

### Project Structure

```
src/
├── common/                    # Shared game logic
│   ├── components/           # React components
│   │   ├── entity-renderers/ # Visual representation of entities
│   │   ├── entity-spawners/  # Entity creation logic
│   │   ├── entity-views/     # Entity-specific views
│   │   ├── lifecycles/       # Game loop management
│   │   ├── leva-plugins/     # Debug UI plugins
│   │   └── postprocesses/    # Visual effects
│   ├── defs/                 # Game constants and definitions
│   ├── hooks/                # Custom React hooks
│   │   ├── ecs/             # ECS-related hooks
│   │   ├── input/           # Input handling hooks
│   │   └── physics/         # Physics integration hooks
│   ├── ldtk/                 # LDtk map editor integration
│   │   ├── components/      # Map rendering components
│   │   ├── models/          # Type definitions
│   │   ├── queries/         # Data queries
│   │   └── utils/           # Helper functions
│   ├── queries/              # React Query setup
│   ├── systems/              # ECS systems (game logic)
│   │   ├── physics/         # Physics-related systems
│   │   └── pressed/         # Input handling systems
│   ├── traits/               # ECS components (data)
│   │   └── fsm/             # Finite State Machine traits
│   └── utils/                # Utility functions
├── store/                    # Global state management
├── views/                    # Application views
│   ├── game/                # Main game view
│   ├── main-menu/           # Menu screen
│   ├── setting/             # Settings screen
│   └── tileset-editor/      # Development tool
└── electron/                 # Electron main process
```

## 🎯 Key Features

### Entity Component System (ECS)

The game uses **Koota** for ECS architecture, separating data (traits) from logic (systems):

**Traits (Components)** - Pure data containers:
- [`IsPlayer`](src/common/traits/IsPlayer.ts), [`IsEnemy`](src/common/traits/IsEnemy.ts), [`IsNPC`](src/common/traits/IsNPC.ts) - Entity type markers
- [`CharacterControllerRef`](src/common/traits/CharacterControllerRef.ts) - Physics controller reference
- [`CharacterStats`](src/common/traits/CharacterStats.ts) - Speed, jump strength, etc.
- [`MoveInput`](src/common/traits/MoveInput.ts), [`JumpInput`](src/common/traits/JumpInput.ts) - Input state
- [`SpriteAnim`](src/common/traits/SpriteAnim.ts) - Animation data
- [`FSM`](src/common/traits/fsm/FSM.ts) - Finite state machine for AI

**Systems** - Logic that operates on entities with specific traits:
- [`pollPlayerInput()`](src/common/systems/pollPlayerInput.ts) - Reads keyboard input
- [`applyCharacterInputToVelocity()`](src/common/systems/applyCharacterInputToVelocity.ts) - Converts input to movement
- [`doJump()`](src/common/systems/doJump.ts) - Handles jump mechanics
- [`applySpriteAnim()`](src/common/systems/applySpriteAnim.ts) - Updates sprite animations
- [`updateCamera()`](src/common/systems/physics/updateCamera.ts) - Camera following logic

### Koota Entity Rendering Pattern

This project implements a unique pattern for rendering Koota entities in React Three Fiber:

#### 1. Entity-View Separation

Entities are created in **Spawners** (data layer) and rendered by **Views** (presentation layer):

```typescript
// Spawner creates the entity with traits
function PlayerSpawner() {
  useEffect(() => {
    world.spawn(
      IsPlayer,
      CharacterStats.speed(5),
      MoveInput(new Vector2(0, 0)),
      // ... other traits
    );
  }, []);
  return null; // Spawners don't render anything
}
```

#### 2. Central Entity Renderer

[`EntityRenderers.tsx`](src/common/components/entity-renderers/EntityRenderers.tsx) acts as a bridge between Koota entities and React components:

```typescript
function EntityRenderers() {
  return (
    <>
      <EntityRenderer params={[IsPlayer]} view={PlayerView} />
      <EntityRenderer params={[IsNPC]} view={NPCView} />
      <EntityRenderer params={[IsEnemy]} view={EnemyView} />
    </>
  );
}
```

The `EntityRenderer` component:
- Uses `useQuery()` to reactively track entities matching specific traits
- Maps each entity to a React component
- Automatically cleans up destroyed entities
- Maintains React keys for proper reconciliation

#### 3. Reference Traits for Three.js Objects

To connect Koota entities with Three.js scene graph, use **reference traits**:

```typescript
// Define reference traits
export const ThreeRef = trait(() => new THREE.Object3D());
export const MeshRef = trait(() => new THREE.Mesh());
export const MaterialRef = trait(() => new MeshLambertMaterial());
```

#### 4. The useRefTrait Hook

[`useRefTrait()`](src/common/hooks/ecs/useRefTrait.ts) injects Three.js object references into entity traits:

```typescript
function PlayerView({ entity }: { entity: Entity }) {
  return (
    <group ref={useRefTrait(entity, ThreeRef)}>
      <mesh ref={useRefTrait(entity, MeshRef)}>
        <planeGeometry args={[2, 2]} />
        <meshLambertMaterial
          ref={useRefTrait(entity, MaterialRef)}
          transparent
        />
      </mesh>
    </group>
  );
}
```

**How it works:**
1. React creates the Three.js object (e.g., `<group>`)
2. `useRefTrait` receives the object reference via React's `ref` callback
3. The reference is stored in the entity's trait
4. Systems can now access and manipulate the Three.js object

#### 5. Systems Update Three.js Objects

Systems query entities and update their Three.js references:

```typescript
// System updates visual position by accessing ThreeRef trait
function syncVisualPositionAndMesh(world: World) {
  world.query(CharacterVisualPosition, ThreeRef)
    .updateEach(([position, threeRef]) => {
      threeRef.position.set(position.x, position.y, threeRef.position.z);
    });
}
```

#### Complete Flow Example

```
1. PlayerSpawner creates entity:
   world.spawn(IsPlayer, CharacterVisualPosition, ...)

2. EntityRenderers queries and renders:
   useQuery(IsPlayer) → [entity1, entity2, ...]
   → <PlayerView entity={entity1} />

3. PlayerView injects references:
   <group ref={useRefTrait(entity, ThreeRef)}>
   → ThreeRef trait now holds the THREE.Object3D

4. Systems update the object:
   world.query(ThreeRef, CharacterVisualPosition)
   → threeRef.position.set(x, y, z)

5. React Three Fiber renders the scene
   → Visual updates appear on screen
```

#### Key Benefits

- **Decoupling**: Game logic (systems) is separate from rendering (views)
- **Performance**: Systems operate on raw data, not React components
- **Flexibility**: Multiple views can render the same entity type differently
- **Reactivity**: `useQuery()` automatically updates when entities spawn/despawn
- **Type Safety**: TypeScript ensures trait compatibility

### Physics Integration

Physics powered by **Rapier2D** (WebAssembly):

```typescript
// Custom character controller with slope climbing and auto-stepping
const controller = new CharacterController(collider, world);
controller.setMaxSlopeClimbAngle(deg2rad(45));
controller.enableAutostep(0.5, 0.01, true);
controller.enableSnapToGround(0.1);
```

Key physics components:
- [`Physics.tsx`](src/common/components/Physics.tsx) - Physics context provider with fixed timestep loop
- [`useCreateCollider()`](src/common/hooks/physics/useCreateCollider.ts) - Hook for creating physics colliders
- [`useBeforePhysicsStep()`](src/common/hooks/physics/useBeforePhysicsStep.tsx) - Pre-physics update hook
- Collision groups for character, terrain, and interaction detection

### LDtk Map Integration

Level design using **LDtk** (Level Designer Toolkit):

- [`LdtkMap.tsx`](src/common/ldtk/components/LdtkMap.tsx) - Main map renderer
- Supports multiple layer types: Tiles, IntGrid, Entities
- Custom entity spawners via `entityRendererMap`
- Custom tile renderers via `tileRendererMap`
- Automatic collision generation from tile data

```typescript
<LdtkMap
  ldtkPath="/assets/ldtk/map.ldtk"
  entityRendererMap={{
    PlayerStart: PlayerSpawner,
    NPC: NPCSpawner,
    Enemy: EnemySpawner,
  }}
  tileRendererMap={{
    RECT: TileRectCollider,
    VOXEL: TileVoxelCollider,
  }}
/>
```

### Game Loop Architecture

Multiple synchronized loops managed by lifecycle components:

1. **Frame Loop** ([`FrameLoop.tsx`](src/common/components/lifecycles/FrameLoop.tsx))
   - Runs at display refresh rate (60 FPS)
   - Handles rendering and visual updates
   - Systems: animation, camera, visual position sync

2. **Physics Loop** ([`PhysicsLoop.tsx`](src/common/components/lifecycles/PhysicsLoop.tsx))
   - Fixed timestep (configurable)
   - Deterministic physics simulation
   - Systems: gravity, velocity, collision

3. **Keyboard Events** ([`KeyboardEvents.tsx`](src/common/components/lifecycles/KeyboardEvents.tsx))
   - Event-driven input handling
   - Separate rhythm input system
   - Customizable key bindings

### Visual Effects

Post-processing pipeline using **@react-three/postprocessing**:

```typescript
<EffectComposer>
  <Sepia intensity={0.2} />
  <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} />
  <Noise opacity={0.07} />
  <Vignette offset={0.1} darkness={1.1} />
</EffectComposer>
```

Pixel-perfect rendering:
- Fixed pixel-per-unit (PPU) ratio
- Custom DPR calculation for consistent pixel size
- `imageRendering: "pixelated"` for crisp sprites

### State Management

- **Constate** for global app state ([`useAppStore.ts`](src/store/useAppStore.ts))
- **React Query** for async data management
- **Koota World** for ECS state
- Local storage integration via Electron IPC

### Electron Integration

Desktop features:
- Custom title bar with window controls
- File system access (read/write user data)
- Display mode switching (windowed, fullscreen, borderless)
- Development/production environment detection
- IPC handlers for file operations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.20.0+

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Web development server
pnpm dev

# Electron development
pnpm dev:electron
```

### Building

```bash
# Build web version
pnpm build

# Build Electron app
pnpm build:electron

# Package for distribution
pnpm package          # Current platform
pnpm package:win      # Windows
pnpm package:mac      # macOS
pnpm package:linux    # Linux
```

## 🎨 Asset Pipeline

### Sprites
- Sprite sheets in `/public/assets/img/`
- Frame-based animation system
- Automatic texture loading and caching

### Maps
- LDtk project files in `/public/assets/ldtk/`
- Tileset images referenced in LDtk
- JSON-based level data

### Audio
- Web Audio DAW integration for music
- Rhythm game mechanics support

## 🛠️ Development Tools

### Debug Features (Development Mode)
- **Leva** - Real-time parameter tweaking
- **r3f-perf** - Performance monitoring
- **Physics Debug Renderer** - Collision visualization
- **React Query Devtools** - Query inspection
- **View Switcher** - Toggle between game and editor

### Tileset Editor
Custom in-game editor for tile collision setup:
- Visual tile selection
- Collision type assignment
- Real-time preview

## 📦 Key Dependencies

### Core
- `react` ^19.1.1 - UI framework
- `@react-three/fiber` ^9.3.0 - React renderer for Three.js
- `@react-three/drei` ^10.7.6 - R3F helpers
- `three` ^0.178.0 - 3D library
- `koota` ^0.5.1 - ECS framework
- `@dimforge/rapier2d` ^0.19.1 - Physics engine

### State & Data
- `@tanstack/react-query` ^5.90.2 - Async state management
- `constate` ^3.3.3 - Context-based state
- `react-use` ^17.6.0 - React hooks library

### Visual Effects
- `@react-three/postprocessing` ^3.0.4 - Post-processing effects
- `postprocessing` ^6.37.8 - Effect implementations
- `wawa-vfx` ^1.2.10 - VFX utilities

### UI & Styling
- `styled-components` ^6.1.19 - CSS-in-JS
- `leva` ^0.10.0 - Debug GUI

### Audio
- `web-audio-daw` ^4.13.4 - Audio engine

### Utilities
- `es-toolkit` ^1.39.10 - Modern utility library
- `jiti` ^2.6.1 - TypeScript runtime

### Electron
- `electron` ^38.3.0 - Desktop framework
- `electron-vite` ^4.0.1 - Vite integration
- `electron-builder` ^26.0.12 - Packaging tool

## 🎮 Controls

Default keyboard controls:
- **WASD** - Movement
- **Space** - Jump
- **Q** - Interact
- **Shift** - Transform
- **CVNM** - Rhythm inputs
- **Escape** - Pause menu

Controls are fully customizable through the settings menu.

## 🏛️ Design Patterns

### Component Composition
React components compose game functionality:
- Spawners create entities
- Renderers display entities
- Views organize game scenes
- Lifecycles manage update loops

### Separation of Concerns
- **Traits** - Data only, no logic
- **Systems** - Logic only, operates on traits
- **Components** - React rendering and lifecycle
- **Hooks** - Reusable logic extraction

### Data-Driven Design
- LDtk maps define level layout
- JSON configuration for game constants
- Sprite sheet metadata for animations
- Collision groups for interaction rules
