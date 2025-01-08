
import { toDisplayString, isObject } from "../utils";
import { insert, remove, text } from "../dom";
import { isJSX } from "../constants";
import type { Template } from "../types";
import { setActiveUpdate, deleteUpdate, pauseTrackUpdate, enableTrackUpdate } from "../reactive";

export function expression(getExpress: () => any): Template {
  pauseTrackUpdate()
  let template: Template = getExpress();
  enableTrackUpdate();

  if (!(isObject(template) && !!template[isJSX])) {
    let node: Text | undefined;
    let update;

    template = {
      render: (target: Element, anchor?: Element) => {
        update = () => {
          const express = getExpress();
          const content = toDisplayString(express);
          if (!node) {
            node = text(content);
            insert(target, node, anchor);
          } else {
            node.nodeValue = content;
          }
        }
        setActiveUpdate(update);
      },
      destroy: () => {
        if (node) {
          remove(node!);
          node = undefined;
        }
        deleteUpdate(update!);
      },
    }
  }
  
  return template;
}