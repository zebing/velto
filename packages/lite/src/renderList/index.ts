import type { RenderListTemplate, BaseTemplate } from "../types";

export function renderList(list: unknown[] = [], renderCallback: (value: any, index: number, array: any[]) => any): RenderListTemplate {
  const cached: BaseTemplate[] = [];
  let cacheTarget: Element;
  let cacheAnchor: Element | undefined;
  const destroy = (len = 0) => {
    for (let i = len; i < cached.length; i++) {
      cached[i].destroy();
    }
    cached.length = len;
  }

  return {
    mount: (target: Element, anchor?: Element) => {
      cacheTarget = target;
      cacheAnchor = anchor;
      list.forEach((item, index, data) => {
        cached[index] = renderCallback(item, index, data);
        cached[index].mount(target, anchor);
      });
    },
    update() {
      list.forEach((item, index, data) => {
        if (!cached[index]) {
          cached[index] = renderCallback(item, index, data);
          cached[index].mount(cacheTarget, cacheAnchor);
        } else {
          cached[index].update();
        }
      });

      if (cached.length > list.length) {
        destroy(list.length);
      }
    },
    destroy() {
      destroy();
    }
  }
}
