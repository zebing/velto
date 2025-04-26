
import type { Template } from "../types";
import { createText, append, remove } from "../dom";

export function text(str: string): Template {
  const el = createText(str);
  return {
    mount: (target: Element, anchor?: Element | Text) => {
      append(target, el, anchor);
    },
    update() {},
    destroy: () => {
      remove(el);
    },
  };
}