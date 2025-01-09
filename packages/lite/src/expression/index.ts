
import { toDisplayString, isTemplate } from "../utils";
import { insert, remove, text } from "../dom";
import type { Template } from "../types";

export function expression(getExpress: () => any): Template {
  let template: Template = getExpress();

  if (!(isTemplate(template))) {
    let cacheTarget: Element;
    let cacheAnchor: Element | undefined;
    let express = template;
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

    template = {
      mount: (target: Element, anchor?: Element) => {
        cacheTarget = target;
        cacheAnchor = anchor;
        update(express);
      },
      update(reactive) {
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
    }
  }
  
  return template;
}