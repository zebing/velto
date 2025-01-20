import type { Render, RenderListTemplate, CompileTemplate } from "../types";
import { markRender } from "../utils";

export function renderList(list: unknown[] = [], renderCallback: (value: any, index: number, array: any[]) => Render<CompileTemplate>): Render<RenderListTemplate> {
  const cached: CompileTemplate[] = [];
  let cacheTarget: Element;
  let cacheAnchor: Element | undefined;
  const destroy = (len = 0) => {
    for (let i = len; i < cached.length; i++) {
      cached[i].destroy();
    }
    cached.length = len;
  }

  return markRender(() => ({
    mount: (target: Element, anchor?: Element) => {
      cacheTarget = target;
      cacheAnchor = anchor;
      list.forEach((item, index, data) => {
        const render = renderCallback(item, index, data);
        cached[index] = render();
        cached[index].mount(target, anchor);
      });
    },
    update(newList: unknown[]) {
      newList.forEach((item, index, data) => {
        if (!cached[index]) {
          const render = renderCallback(item, index, data);
          cached[index] = render();
          cached[index].mount(cacheTarget, cacheAnchor);
        } else {
          cached[index].update();
        }
      });

      if (cached.length > newList.length) {
        destroy(newList.length);
      }
    },
    destroy() {
      destroy();
    }
  }));
}
