import { isEvent } from "../utils";
import { append, insert, remove } from "../dom";
import { isJSX } from "../constants";
import { classe, attr, event, style } from './attribute';
import type { Style } from "./attribute";
import type { Template } from "../types";
import { setActiveUpdate, deleteUpdate } from "../reactive";

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
  let update;
  return {
    [isJSX]: true,
    render: (target: Element, anchor?: Element) => {
      addChildren(target, el, anchor);
      update = () => {
        const props = getProps();
        for(let attr in props) {
          setAttribute(el, attr, props[attr]);
        }
      }

      setActiveUpdate(update);
    },
    destroy() {
      deleteUpdate(update!);
      remove(el);
    }
  }
}
