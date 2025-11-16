import { Html, useProgress } from "@react-three/drei";
import styled from "styled-components";

export function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <LoaderContainer>
        Loading...
        <ProgressBarContainer>
          <ProgressBarFill progress={progress} />
        </ProgressBarContainer>
        <ProgressText>
          { progress.toFixed(0) }
          {" "}
          %
        </ProgressText>
      </LoaderContainer>
    </Html>
  );
}

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250px;
  padding: 30px;
  background-color: #2a2a2a;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  color: #ececec;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
`;

const ProgressText = styled.div`
  margin-top: 15px;
  font-size: 1.2rem;
  color: #ccc;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: #555;
  border: 2px solid #888;
  border-radius: 2px;
  margin-top: 20px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: #4CAF50;
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
  image-rendering: pixelated;
`;
