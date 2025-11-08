import { useState, useEffect } from "react";
import { type KeyboardControlsEntry } from "@react-three/drei";
import { keyboardControlMap, type KeyboardControlType } from "@/common/defs/keyboardControlMap.ts";
import constate from "constate";

type GameState = "main" | "play" | "setting";
type KeymapEntry = KeyboardControlsEntry<KeyboardControlType>;
export type DisplayMode = "window" | "borderless";

function useAppStore() {
  const [gameState, setGameState] = useState<GameState>("main");
  const [activeKeymap, setActiveKeymap] = useState<KeymapEntry[]>(keyboardControlMap);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("window");
  const [previousGameState, setPreviousGameState] = useState<GameState>("main");
  const [isPaused, setIsPaused] = useState(false);

  const pauseGame = () => setIsPaused(true);
  const resumeGame = () => setIsPaused(false);

  useEffect(() => {
    async function loadKeymap() {
      if (!window.api) {
        return;
      }
      try {
        const result = await window.api.readUserData("keymap.json");
        if (result.data) {
          const savedMap = JSON.parse(result.data) as KeymapEntry[];
          if (Array.isArray(savedMap) && savedMap.length === keyboardControlMap.length) {
            setActiveKeymap(savedMap);
          }
        }
      }
      catch {
        console.log("No custom keymap found, using defaults.");
      }
    }
    loadKeymap();
  }, []);

  const handleKeymapChange = (newMap: KeymapEntry[]) => {
    setActiveKeymap(newMap);
    window.api?.writeUserData("keymap.json", JSON.stringify(newMap))
      .catch(err => console.error("Failed to save keymap:", err));
  };

  const startGame = () => setGameState("play");
  const showSettings = () => {
    if (gameState === "main" || gameState === "play") {
      setPreviousGameState(gameState);
    }
    setGameState("setting");
  };
  const goBackFromSettings = () => {
    setGameState(previousGameState);

    if (previousGameState === "play") {
      setIsPaused(true);
    }
  };
  const showMenu = () => setGameState("main");

  return {
    gameState,
    activeKeymap,
    startGame,
    showSettings,
    goBackFromSettings,
    showMenu,
    handleKeymapChange,
    displayMode,
    setDisplayMode,
    isPaused,
    pauseGame,
    resumeGame,
  };
}

export const [AppProvider, useApp] = constate(useAppStore);
