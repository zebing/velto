import { isEvent } from "@velto/shared";
import { append, insert, remove, createElement } from "../dom";
import { classe, attr, event, style } from './attribute';
import type { Style } from "./attribute";
import type { ElementTemplate } from "../types";

export const setAttribute = (
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

export function element(
  tag: string,
  props: Record<string, unknown>,
): ElementTemplate {
  const el = createElement(tag);
  return {
    el,
    mount: (target: Element, anchor?: Element | Text) => {
      append(target, el, anchor);
      for(let attr in props) {
        setAttribute(el, attr, props[attr]);
      }
    },

    update(newProps: Record<string, unknown>) {
      for(let attr in newProps) {
        if (newProps[attr] !== props?.[attr] && !isEvent(attr)) {
          setAttribute(el, attr, newProps[attr]);
        }
      }
      props = newProps;
    },
    destroy() {
      remove(el);
    }
  }
}
