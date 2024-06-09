import type { Style } from "./style";
import classe from "./class";
import style from "./style";
import event from "./events";
import attr from "./attrs";

export { classe, style, event, attr };
export type { Style } from "./style";

export const isEvent = (key: string) => /^on[^a-z]/.test(key);

export const spreadAttr = (
  el: Element,
  key: string,
  value: unknown,
  isSVG = false,
) => {
  if (key === 'class') {
    classe(el, value as string | null, isSVG);
  } else if (key === 'style') {
    style(el, value as Style);
  } else if (isEvent(key)) {
    event(el, key, value as EventListener);
  } else {
    attr(el, key, value, isSVG);
  }
}
