import styled from "styled-components";

const TitleBarContainer = styled.div`
  height: 32px;
  background: #2a2a2a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 12px;
  color: #ccc;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  flex-shrink: 0;
`;

const WindowControls = styled.div`
  display: flex;
  -webkit-app-region: no-drag;
`;

const ControlButton = styled.button`
  width: 46px;
  height: 32px;
  border: none;
  background: transparent;
  color: white;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  -webkit-app-region: no-drag;

  &:hover {
    background: #4a4a4a;
  }

  &.close-btn:hover {
    background: #e81123;
  }
`;

function TitleBar() {
  const handleMinimize = () => window.api?.minimizeWindow();
  const handleMaximize = () => window.api?.toggleMaximizeWindow();
  const handleClose = () => window.api?.closeWindow();

  return (
    <TitleBarContainer>
      <span>Game Title</span>
      <WindowControls>
        <ControlButton onClick={handleMinimize}>−</ControlButton>
        <ControlButton onClick={handleMaximize}>◻</ControlButton>
        <ControlButton className="close-btn" onClick={handleClose}>
          ✕
        </ControlButton>
      </WindowControls>
    </TitleBarContainer>
  );
}

export default TitleBar;
