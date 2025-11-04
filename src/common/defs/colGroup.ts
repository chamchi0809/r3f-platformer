import { interactionGroups } from "@/common/utils/interactionGroups.ts"

export type ColGroup = keyof typeof COL_GROUP
export const COL_GROUP = {
  DEFAULT: 0,
  WHITE: 1,
  BLACK: 2,
} as const

export const INTERACTION_GROUPS: Record<ColGroup, number> = {
  DEFAULT: interactionGroups(COL_GROUP.DEFAULT),
  WHITE: interactionGroups(COL_GROUP.WHITE, [COL_GROUP.DEFAULT, COL_GROUP.WHITE]),
  BLACK: interactionGroups(COL_GROUP.BLACK, [COL_GROUP.DEFAULT, COL_GROUP.BLACK]),
}
