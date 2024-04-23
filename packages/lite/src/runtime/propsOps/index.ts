import setClass from "./class";
import { setStyle } from "./style";
import type { Style } from "./style";
import { setEvent } from "./events";
import { setAttribute } from "./attrs";
import { trackEffect, EffectWithEl } from "./effect";

export { trackEffect } from "./effect";
export type { Style } from "./style";
export type { EffectWithEl } from "./effect";

export const isEvent = (key: string) => /^on[^a-z]/.test(key);

export const setProp = (
  el: Element,
  key: string,
  value: unknown,
  isSVG = false,
) => {
  if (key === 'class') {
    setClass(el, value as string | null, isSVG);
  } else if (key === 'style') {
    setStyle(el, value as Style);
  } else if (key === 'effect') {
    trackEffect(el, value as EffectWithEl);
  } else if (isEvent(key)) {
    setEvent(el, key, value as EventListener);
  } else {
    setAttribute(el, key, value, isSVG);
  }
}
