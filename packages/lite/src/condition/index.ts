import type { ConditionTemplate, ExpressTemplate } from "../types";

export function condition(template: ExpressTemplate, initCondition: boolean): ConditionTemplate {
  let cacheTarget: Element;
  let cacheAnchor: Element | undefined;

  return {
    mount: (target: Element, anchor?: Element) => {
      cacheTarget = target;
      cacheAnchor = anchor;
      initCondition && template.mount(target, anchor);
    },
    update(newCondition: boolean, newExpress: any) {
      if (newCondition !== initCondition) {
        newCondition ? template.mount(cacheTarget, cacheAnchor) : template.destroy();
      } else {
        newCondition ? template.update(newExpress) : template.destroy();
      }
      initCondition = newCondition;
    },
    destroy: () => {
      template.destroy();
    },
  }
}