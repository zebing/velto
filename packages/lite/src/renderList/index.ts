import { isJSX } from "../constants";
import type { Template } from "../types";
import { setActiveUpdate, deleteUpdate } from "../reactive";

export function renderList(getData: () => any[], renderCallback: (value: any, index: number, array: any[]) => any): Template {
  const cached: Template[] = [];
  let update;
  const destroy = (len = 0) => {
    for (let i = len; i < cached.length; i++) {
      cached[i].destroy();
    }
    cached.length = len;
  }

  return {
    [isJSX]: true,
    render: (target: Element, anchor?: Element) => {
      update = () => {
        const data = getData() || [];
        data?.forEach((item, index, data) => {
          if (!cached[index]) {
            cached[index] = renderCallback(item, index, data);
            cached[index].render(target, anchor);
          }
        });

        if (cached.length > data.length) {
          destroy(data.length);
        }
      }
      
      setActiveUpdate(update);
    },
    destroy() {
      destroy();
      deleteUpdate(update!);
    }
  }
}
