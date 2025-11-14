import type { EntityInstance } from "@/common/ldtk/models/LdtkTypes.ts";

export const stripEntityInstanceFields = <T extends object>(entity: EntityInstance) => {
  return Object.fromEntries(entity.fieldInstances.map(field => [field.__identifier, field.__value])) as T;
};
