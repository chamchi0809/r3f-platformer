import styled from "styled-components";

const Container = styled.kbd`
  display: inline-block;

  margin: 0 4px;
  padding: 2px 6px;
  border: 1px solid #555;
  border-radius: 3px;

  background: #222;

  color: white;
`;

export default function Kbd({ label }: { label: string }) {
  return (<Container>{label.replace(/^Key/, "")}</Container>);
}
