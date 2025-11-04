import { use } from "react";
import { RapierContext } from "@/common/components/Physics.tsx";

export default function useRapier() {
  const rapier = use(RapierContext);
  if (!rapier) {
    throw new Error("useRapier must be used within a <Physics> component");
  }
  return rapier;
}
