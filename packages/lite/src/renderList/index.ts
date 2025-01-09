import type { Template } from "../types";

export function renderList(getData: () => any[], renderCallback: (value: any, index: number, array: any[]) => any): Template {
  const cached: Template[] = [];
  const destroy = (len = 0) => {
    for (let i = len; i < cached.length; i++) {
      cached[i].destroy();
    }
    cached.length = len;
  }

  return {
    mount: (target: Element, anchor?: Element) => {
      const data = getData() || [];
      data?.forEach((item, index, data) => {
        if (!cached[index]) {
          cached[index] = renderCallback(item, index, data);
          cached[index].mount(target, anchor);
        }
      });

      if (cached.length > data.length) {
        destroy(data.length);
      }
    },
    update(reactive) {
        
    },
    destroy() {
      destroy();
    }
  }
}
