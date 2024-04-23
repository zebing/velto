import { getComponentContext } from "../component";
import { Effect } from "../../reactive";

export type EffectWithEl = (el: Element | Text) => Effect;

export function trackEffect(el: Element | Text, effect?: EffectWithEl) {
  const ctx = getComponentContext();
  if (effect && ctx?.effects) {
    ctx.effects.push(effect(el));
  }
}