
import { isRender, toDisplayString } from "../utils";
import { insert, remove, createText } from "../dom";
import type { ExpressTemplate } from "../types";

export function expression(express: any): ExpressTemplate {
  if (isRender(express)) return express();
  
  let cacheTarget: Element;
  let cacheAnchor: Element | Comment | undefined;
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
    mount: (target, anchor) => {
      cacheTarget = target;
      cacheAnchor = anchor;
      update(express);
    },
    update(newExpress: any) {
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