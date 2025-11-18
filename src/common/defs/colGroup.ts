import { interactionGroups } from "@/common/utils/interactionGroups.ts";

export type ColGroup = keyof typeof COL_GROUP;
export const COL_GROUP = {
  DEFAULT: 0,
  CHARACTER: 1,
  SENSOR: 2,
} as const;

export const INTERACTION_GROUPS: Record<ColGroup, number> = {
  DEFAULT: interactionGroups(COL_GROUP.DEFAULT),
  CHARACTER: interactionGroups(COL_GROUP.CHARACTER, [COL_GROUP.DEFAULT, COL_GROUP.SENSOR]),
  SENSOR: interactionGroups(COL_GROUP.SENSOR),
};
