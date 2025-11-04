import { trait } from "koota";

export type PlayerColor = "white" | "black";

export const PlayerStates = trait(() => ({
  color: "white" as PlayerColor,
}));
