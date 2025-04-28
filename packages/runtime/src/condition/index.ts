import type { ConditionTemplate, ExpressTemplate } from "../types";
import { text, append } from "../dom";

export function condition(template: ExpressTemplate, initCondition: boolean): ConditionTemplate {
  let cacheTarget: Element;
  let cacheAnchor: Element | Text | undefined;

  return {
    mount: (target: Element, anchor?: Element | Text) => {
      cacheTarget = target;
      cacheAnchor = text(" ");
      append(target, cacheAnchor, anchor);
      initCondition && template.mount(target, cacheAnchor);
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
  };
}