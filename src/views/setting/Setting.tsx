import "@/views/setting/Setting.css";
import { useEffect, useState } from "react";
import type { KeyboardControlType } from "@/common/defs/keyboardControlMap.ts";
import type { KeyboardControlsEntry } from "@react-three/drei";

interface SettingsMenuProps {
  onShowMenu: () => void
  currentKeymap: KeyboardControlsEntry<KeyboardControlType>[]
  onKeymapChange: (newMap: KeyboardControlsEntry<KeyboardControlType>[]) => void
}

function Setting({ onShowMenu, currentKeymap, onKeymapChange }: SettingsMenuProps) {
  const [volume, setVolume] = useState(1);
  const [rebindingAction, setRebindingAction] = useState<KeyboardControlType | null>(null);

  useEffect(() => {
    if (!rebindingAction) return;

    const handleKeydown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newKey = e.code;

      if (newKey === "Escape") {
        setRebindingAction(null);
        return;
      }

      const newMap = currentKeymap.map(entry =>
        entry.name === rebindingAction
          ? { ...entry, keys: [newKey] }
          : entry,
      );

      onKeymapChange(newMap);
      setRebindingAction(null);
    };

    window.addEventListener("keydown", handleKeydown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeydown, { capture: true });
    };
  }, [rebindingAction, currentKeymap, onKeymapChange]);

  const handleDisplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "fullscreen") {
      window.api?.setFullScreen();
    }
    else if (value === "maximize") {
      window.api?.maximizeWindow();
    }
    else {
      const parts = value.split("x");
      const width = parseInt(parts[0], 10);
      const height = parseInt(parts[1], 10);

      if (!isNaN(width) && !isNaN(height)) {
        window.api?.setWindowSize(width, height);
      }
    }
  };

  return (
    <div className="main-menu-container">
      <div className="menu-box">
        <h1 className="game-title settings-title">
          Setting
        </h1>

        <div className="settings-list">
          <div className="setting-row">
            <label className="setting-label">Display Mode</label>
            <select className="setting-select" onChange={handleDisplayChange} defaultValue="1200x640">
              <option value="fullscreen">Fullscreen</option>
              <option value="maximize">Borderless Window</option>
              <option value="1920x1080">1920x1080</option>
              <option value="1600x900">1600x900</option>
              <option value="1200x640">1200x640</option>
            </select>
          </div>

          <div className="setting-row">
            <label className="setting-label">
              Sound:
              {" "}
              {Math.round(volume * 100)}
              %
            </label>
            <input
              type="range"
              className="volume-slider" // CSS 스타일을 위한 클래스
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
            />
          </div>

          {currentKeymap.map(entry => (
            <div className="setting-row" key={entry.name}>
              <label className="setting-label" style={{ textTransform: "capitalize" }}>
                {entry.name}
              </label>

              <button
                className="rebind-button"
                onClick={() => setRebindingAction(entry.name)}
              >
                {rebindingAction === entry.name
                  ? "Press any key..."
                  : entry.keys[0]}
              </button>
            </div>
          ))}
        </div>

        <div className="menu-buttons settings-buttons-container">
          <button onClick={onShowMenu}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default Setting;
