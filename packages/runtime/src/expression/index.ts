
import { toDisplayString, isRender } from "../utils";
import { insert, remove, text } from "../dom";
import type { ExpressTemplate } from "../types";

export function expression(express: any): ExpressTemplate {
  if (isRender(express)) return express();
  
  let cacheTarget: Element;
  let cacheAnchor: Element | undefined;
  let node: Text | undefined;
  const update = (express: any) => {
    const content = toDisplayString(express);
    if (!node) {
      node = text(content);
      insert(cacheTarget, node, cacheAnchor);
    } else {
      node.nodeValue = content;
    }
  }

  return {
    mount: (target: Element, anchor?: Element) => {
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