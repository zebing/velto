import type { Render, RenderListTemplate, CompileTemplate } from "../types";
import { markRender } from "../utils";
import { text, append, insert } from "../dom";

interface cachedData {
  template: CompileTemplate,
  anchor: Text,
}

export function renderList(list: unknown[] = [], renderCallback: (value: any, index: number, array: any[]) => Render): Render {
  let cachedMap = new Map<any, cachedData>();
  let cacheTarget: Element;
  let cacheAnchor: Element | undefined;

  return markRender(() => ({
    mount: (target: Element, anchor?: Element) => {
      cacheTarget = target;
      cacheAnchor = anchor;
      list.forEach((item, index, data) => {
        const itemAnchor = text('');
        append(target, itemAnchor, anchor);
        const render = renderCallback(item, index, data);
        const template = render();
        template.mount(cacheTarget, itemAnchor);
        cachedMap.set(item, {
          template,
          anchor: itemAnchor,
        });
      });
    },
    update(newList: unknown[]) {
      const newCachedMap = new Map<any, cachedData>();
      newList.forEach((item, index, data) => {
        const preItemCached = newCachedMap.get(data[index - 1]);
        const chachedData = cachedMap.get(item);

        if (chachedData) {
          newCachedMap.set(item, chachedData);
          cachedMap.delete(item);
          chachedData.template.update();
        } else {
          const itemAnchor = text('');
          if (preItemCached) {
            insert(cacheTarget, itemAnchor, preItemCached.anchor.nextSibling);
          } else {
            insert(cacheTarget, itemAnchor, cacheTarget.firstChild);
          }
          
          const render = renderCallback(item, index, data);
          const template = render();
          template.mount(cacheTarget, itemAnchor);
          newCachedMap.set(item, {
            template,
            anchor: itemAnchor,
          });
        }
      });
      cachedMap.forEach((item, key) => {
        item.template.destroy();
      });
      cachedMap = newCachedMap;
    },
    destroy() {
      cachedMap.forEach((item) => {
        item.template.destroy();
      });
      cachedMap.clear();
    }
  }));
}
