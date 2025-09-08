
import { remove, createText, append } from "../dom";
import type { Template } from "../types";

export function text(text: string): Template {
  let node: Text | undefined;

  return {
    mount: (target, anchor) => {
      node = createText(text);
      append(target, node, anchor);
    },
    destroy: () => {
      if (node) {
        remove(node!);
        node = undefined;
      }
    },
  };
}