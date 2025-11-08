import styled from "styled-components";
import { useEffect, useState } from "react";
import type { KeyboardControlType } from "@/common/defs/keyboardControlMap.ts";
import { useApp } from "@/store/useAppStore.ts";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a1a;
  color: white;
`;

const MenuBox = styled.div`
  background-color: #2a2a2a;
  padding: 40px 60px;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 400px;
  max-height: 70vh;
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 40px;
  color: #ececec;
`;

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 30px;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const SettingLabel = styled.label`
  font-size: 1.1rem;
  color: #ccc;
  flex-shrink: 0;
`;

const SettingSelect = styled.select`
  padding: 8px 20px;
  font-size: 1rem;
  background-color: #3a3a3a;
  color: white;
  border: 1px solid #555;
  border-radius: 5px;
  cursor: pointer;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M287%20197.3l-136.3-136.2c-5.4-5.4-14.2-5.4-19.6%200L5.4%20197.3c-5.4%205.4-5.4%2014.2%200%2019.6l19.6%2019.6c5.4%205.4%2014.2%205.4%2019.6%200l91.6-91.6c5.4-5.4%2014.2-5.4%2019.6%200l91.6%2091.6c5.4%205.4%2014.2%205.4%2019.6%200l19.6-19.6c5.4-5.2%205.4-14.2%200-19.6z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  background-size: 10px;

  &:hover {
    border-color: #777;
  }
  &:focus {
    outline: none;
    border-color: #777;
    box-shadow: 0 0 0 2px rgba(236, 236, 236, 0.2);
  }
`;

const VolumeSlider = styled.input.attrs({ type: "range" })`
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  background: #555;
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #ececec;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #ececec;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const RebindButton = styled.button<{ isError?: boolean }>`
  padding: 8px 12px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #4a4a4a;
  border: 2px solid ${props => (props.isError ? "#e81123" : "#4a4a4a")};
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  min-width: 150px;
  text-align: center;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background-color: #6a6a6a;
  }

  &:focus,
  &:active {
    background-color: #3a3a3a;
    border-color: ${props => (props.isError ? "#e81123" : "#ececec")};
  }
`;

const MenuButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
`;

const BackButton = styled.button`
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #4a4a4a;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #6a6a6a;
  }

  &:active {
    transform: scale(0.98);
  }
`;

type KeyBindError = {
  action: KeyboardControlType
  message: string
};

function Setting() {
  const {
    goBackFromSettings,
    activeKeymap,
    handleKeymapChange,
    setDisplayMode,
    displayMode,
  } = useApp();

  const [volume, setVolume] = useState(1);
  const [rebindingAction, setRebindingAction] = useState<KeyboardControlType | null>(null);
  const [keyError, setKeyError] = useState<KeyBindError | null>(null);

  useEffect(() => {
    if (!rebindingAction) return;

    const handleKeydown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newKey = e.code;

      if (newKey === "Escape") {
        setRebindingAction(null);
        setKeyError(null);
        return;
      }

      const duplicateAction = activeKeymap.find(entry =>
        entry.keys.includes(newKey) && entry.name !== rebindingAction,
      );

      if (duplicateAction) {
        setKeyError({
          action: rebindingAction,
          message: `Used by: ${duplicateAction.name}`,
        });
        setRebindingAction(null);
        return;
      }

      setKeyError(null);

      const newMap = activeKeymap.map(entry =>
        entry.name === rebindingAction
          ? { ...entry, keys: [newKey] }
          : entry,
      );

      handleKeymapChange(newMap);
      setRebindingAction(null);
    };

    window.addEventListener("keydown", handleKeydown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeydown, { capture: true });
    };
  }, [rebindingAction, activeKeymap, handleKeymapChange]);

  const handleDisplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDisplayMode(value);

    if (value === "fullscreen") {
      setDisplayMode("fullscreen");
      window.api?.setFullScreen();
    }
    else if (value === "maximize") {
      setDisplayMode("borderless");
      window.api?.setBorderlessScreen();
    }
    else {
      const parts = value.split("x");
      const width = parseInt(parts[0], 10);
      const height = parseInt(parts[1], 10);

      if (!isNaN(width) && !isNaN(height)) {
        setDisplayMode(value);
        window.api?.setWindowSize(width, height);
      }
    }
  };

  return (
    <Container>
      <MenuBox>
        <Title>Setting</Title>

        <SettingsList>
          <SettingRow>
            <SettingLabel>Display Mode</SettingLabel>
            <SettingSelect onChange={handleDisplayChange} value={displayMode}>
              <option value="fullscreen">Fullscreen</option>
              {/* <option value="maximize">Borderless Window</option> */}
              <option value="1920x1080">1920x1080</option>
              <option value="1600x900">1600x900</option>
              <option value="1200x640">1200x640</option>
            </SettingSelect>
          </SettingRow>

          <SettingRow>
            <SettingLabel>
              Sound:
              {" "}
              {Math.round(volume * 100)}
              %
            </SettingLabel>
            <VolumeSlider
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
            />
          </SettingRow>

          {activeKeymap.map((entry) => {
            const isError = keyError?.action === entry.name;

            let buttonText: string;
            if (rebindingAction === entry.name) {
              buttonText = "Press any key...";
            }
            else if (isError) {
              buttonText = keyError.message;
            }
            else {
              buttonText = entry.keys[0];
            }

            return (
              <SettingRow key={entry.name}>
                <SettingLabel style={{ textTransform: "capitalize" }}>
                  {entry.name}
                </SettingLabel>

                <RebindButton
                  isError={isError}
                  onClick={() => {
                    setRebindingAction(entry.name);
                    setKeyError(null);
                  }}
                >
                  {buttonText}
                </RebindButton>
              </SettingRow>
            );
          })}
        </SettingsList>

        <MenuButtons>
          <BackButton onClick={goBackFromSettings}>Back</BackButton>
        </MenuButtons>
      </MenuBox>
    </Container>
  );
}

export default Setting;
