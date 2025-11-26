import { type Norm, trait, type Trait, type TraitValue } from "koota";

type TraitDefSchema = Parameters<typeof trait>[0];
type TraitSchema<T extends Trait> = T["schema"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TraitAction<T extends Trait, Args extends any[] = []> = (
  value: TraitValue<TraitSchema<T>>,
  ...args: Args
) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const traitWithActions = <TSchema extends TraitDefSchema, TTrait extends Trait<Norm<TSchema>>, TActions extends Record<string, TraitAction<TTrait, any[]>>>(s: TSchema, actions: TActions) => {
  const traitDef = trait(s);
  traitDef.prototype.actions = (traitVal: TraitValue<TraitSchema<TTrait>>) => {
    return Object.fromEntries(
      Object.entries(actions).map(([name, action]) => [
        name,
        (...args: never[]) => {
          action(traitVal, ...args);
        },
      ]),
    ) as {
      [K in keyof TActions]: TActions[K] extends TraitAction<TTrait, infer Args>
        ? (...args: Args) => void
        : never;
    };
  };

  return traitDef as TTrait & {
    actions: (traitVal: TraitValue<TraitSchema<TTrait>>) => {
      [K in keyof TActions]: TActions[K] extends TraitAction<TTrait, infer Args>
        ? (...args: Args) => void
        : never;
    }
  };
};
