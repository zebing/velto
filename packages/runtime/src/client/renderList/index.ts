import type { Render, CompileTemplate, RenderListTemplate } from "../types";
import { comment, append, insert, remove } from "../dom";

interface cachedData {
  template: CompileTemplate,
  item: any,
  lastElement: Element | null;
}

export function renderList(list: unknown[] = [], renderCallback: (value: any, index: number, array: any[]) => Render): RenderListTemplate {
  let cacheTarget: Element;
  const startAnchor = comment('[');
  const endAnchor = comment(']');
  const cached: cachedData[] = [];

  const create = (options: {
    list: unknown[];
    index: number;
    anchor: Element | Comment;
  }) => {
    const { list, index, anchor } = options;
    const item = list[index];

    const render = renderCallback(item, index, list);
    const template = render();
    template.mount(cacheTarget, anchor);
    cached[index] = {
      template,
      item,
      lastElement: anchor.previousElementSibling,
    }
  }

  return {
    mount: (target, anchor) => {
      cacheTarget = target;
      append(target, startAnchor, anchor);
      append(target, endAnchor, anchor);

      list.forEach((_, index) => {
        create({ list, index, anchor: endAnchor });
      });
    },
    update(newList: unknown[]) {
      const newLength = newList.length;
      const cachedLength = cached.length;
      const needAddCachedLength = newLength - cachedLength;

      let i = 0;
      let e = 0;

      while(i < newLength && i < cachedLength) {
        const cachedItem = cached[i];
        const item = newList[i];

        if (cachedItem.item === item) {
          cachedItem.template.update();
          i++;
        } else {
          break;
        }
      }

      while (e < newLength && e < cachedLength) {
        const cachedItem = cached[cachedLength - e - 1];
        const item = newList[newLength - e - 1];
        if (cachedItem.item === item) {
          cachedItem.template.update();
          e++;
        } else {
          break;
        }
      }

      let newListPreIndex = i - 1;
      let cachedPreIndex = i - 1;
      let newListEndIndex = newLength - e;
      let cachedEndIndex = cachedLength - e;
      const newCached: (cachedData | undefined)[] = cached;

      if (needAddCachedLength > 0) {
        newCached.splice(cachedEndIndex, 0, ...(Array.from({ length: needAddCachedLength }) as undefined[]));

        for (newListPreIndex++; newListPreIndex < newListEndIndex; newListPreIndex++) {
          const cachedItem = newCached[newListPreIndex];

          if (cachedItem) {
            cachedItem.template.update();
          } else {
            const preItemCached = newCached[newListPreIndex - 1];
            if (preItemCached) {
              create({ list: newList, index: newListPreIndex, anchor: preItemCached.lastElement?.nextSibling as Element });
            } else {
              create({ list: newList, index: newListPreIndex, anchor: startAnchor.nextSibling as Element });
            }
          }
        }
      } else if (needAddCachedLength < 0) {
        let startIndex = -1;
        let destroyCount = 0;

        for(cachedPreIndex++; cachedPreIndex < cachedEndIndex; cachedPreIndex++) {
          const cachedItem = newCached[cachedPreIndex]!;

          if (cachedPreIndex < newListEndIndex) {
            cachedItem.template.update();
          } else {
            cachedItem.template.destroy();

            if (startIndex === -1) {
              startIndex = cachedPreIndex;
            }
            destroyCount++;
          }
        }

        if (destroyCount) {
          newCached.splice(startIndex, destroyCount);
        }
      }
    },
    destroy() {
      cached.forEach((item) => {
        item.template.destroy();
      });
      cached.length = 0;
    }
  };
}
