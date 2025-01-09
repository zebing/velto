import { isEvent } from "../utils";
import { append, insert, remove } from "../dom";
import { classe, attr, event, style } from './attribute';
import type { Style } from "./attribute";
import type { Template } from "../types";

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
  el: Element,
  addChildren: typeof append | typeof insert,
  getProps: () => Record<string, unknown>,
): Template {
  let props = getProps();
  const update = (
    newProps: Record<string, unknown>,
    oldProps?: Record<string, unknown>,
  ) => {
    for(let attr in newProps) {
      const needUpdate = !oldProps || newProps[attr] !== oldProps?.[attr];
      if (needUpdate) {
        setAttribute(el, attr, newProps[attr]);
      }
    }
  }

  return {
    mount: (target: Element, anchor?: Element) => {
      addChildren(target, el, anchor);
      for(let attr in props) {
        setAttribute(el, attr, props[attr]);
      }
    },

    update(reactive) {
      const newProps = getProps();
      for(let attr in newProps) {
        if (newProps[attr] !== props?.[attr]) {
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
