import type { Template } from "../types";

export function condition(template: Template, getCondition: () => boolean): Template {
  let cacheTarget: Element;
  let cacheAnchor: Element | undefined;
  let condition = getCondition();

  return {
    mount: (target: Element, anchor?: Element) => {
      cacheTarget = target;
      cacheAnchor = anchor;
      condition && template.mount(target, anchor);
    },
    update(reactive) {
      const newCondition = getCondition();
      if (newCondition !== condition) {
        newCondition ? template.mount(cacheTarget, cacheAnchor) : template.destroy();
      } else {
        newCondition ? template.update(reactive) : template.destroy();
      }
      condition = newCondition;
    },
    destroy: () => {
      template.destroy();
    },
  }
}