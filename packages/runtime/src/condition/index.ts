import type { ConditionTemplate, ExpressTemplate } from "../types";
import { comment, append } from "../dom";

export function condition(template: ExpressTemplate, initCondition: boolean): ConditionTemplate {
  let cacheTarget: Element;
  let cacheAnchor: Element | Comment | undefined;

  return {
    mount: (target, anchor) => {
      cacheTarget = target;
      cacheAnchor = comment('');
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