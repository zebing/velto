import { EffectType } from "./effect";

export type Dep = Set<EffectType>;

export const createDep = (): Dep => {
  const dep = new Set() as Dep;
  return dep;
}