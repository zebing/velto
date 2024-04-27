import type { Style } from "./style";
import setClass from "./class";
import { setStyle } from "./style";
import { setEvent } from "./events";
import { setAttribute } from "./attrs";

export type { Style } from "./style";

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
  } else if (isEvent(key)) {
    setEvent(el, key, value as EventListener);
  } else {
    setAttribute(el, key, value, isSVG);
  }
}
