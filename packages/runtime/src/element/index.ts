import { isEvent } from "@velto/shared";
import { append, insert, remove, createElement } from "../dom";
import { classe, attr, event, style } from './attribute';
import type { Style } from "./attribute";
import type { Template } from "../types";
import { children } from '../children';

export const setAttribute = (
  el: Element,
  key: string,
  value: unknown,
  isSVG = false,
) => {
  if (key === 'ref') {
    // @ts-expect-error
    value?.setValue?.(el);
  } else if (key === 'innerHTML') {
    el.innerHTML = `${value}`;
  } else if (key === 'textContent') {
    el.textContent = `${value}`;
  } else if (key === 'class') {
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
  getProps: null | (() => Record<string, unknown>),
  childList?: Template[],
): Template {
  let props = {} as Record<string, unknown>;
  const el = createElement(tag);
  const childTemplate = childList?.length ? children(childList) : undefined;

  return {
    mount: (target: Element, anchor?: Element | Text) => {
      append(target, el, anchor);
      if (getProps) {
        props = getProps();
        for (let attr in props) {
          setAttribute(el, attr, props[attr]);
        }
      }
      childTemplate?.mount(el);
    },

    update() {
      if (getProps) {
        const newProps = getProps();
        for (let attr in newProps) {
          if (newProps[attr] !== props[attr]) {
            setAttribute(el, attr, newProps[attr]);
          }
        }
        props = newProps;
      }
      childTemplate?.update();
    },
    destroy() {
      remove(el);
      childTemplate?.destroy();
    }
  }
}
