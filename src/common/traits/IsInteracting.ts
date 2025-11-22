import { trait } from "koota";

export type InteractionType = "talk" | "battle";

export const IsInteracting = trait<{
  type: InteractionType
}>({
  type: "talk",
});
