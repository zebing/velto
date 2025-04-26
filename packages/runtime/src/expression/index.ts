
import { isRender, toDisplayString } from "../utils";
import { insert, remove, createText } from "../dom";
import type { Template } from "../types";
import { Render } from "../types";

export function expression(getExpress: () => unknown): Template {
  let express = getExpress();
  if (isRender(express)) return (express as Render)();
  
  let cacheTarget: Element;
  let cacheAnchor: Element | Text | undefined;
  let node: Text | undefined;
  const update = (express: any) => {
    const content = toDisplayString(express);
    if (!node) {
      node = createText(content);
      insert(cacheTarget, node, cacheAnchor);
    } else {
      node.nodeValue = content;
    }
  }

  return {
    mount: (target: Element, anchor?: Element | Text) => {
      cacheTarget = target;
      cacheAnchor = anchor;
      update(express);
    },
    update() {
      const newExpress = getExpress();
      if (express !== newExpress) {
        update(newExpress);
      }

      express = newExpress;
    },
    destroy: () => {
      if (node) {
        remove(node!);
        node = undefined;
      }
    },
  };
}