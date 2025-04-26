import type { Template } from "../types";
import { createText, append } from "../dom";

export function condition(getCondition: () => boolean, template: Template): Template {
  let cacheTarget: Element;
  let cacheAnchor: Element | Text | undefined;
  let conditionValue = getCondition();

  return {
    mount: (target: Element, anchor?: Element | Text) => {
      cacheTarget = target;
      cacheAnchor = createText(" ");
      append(target, cacheAnchor);
      conditionValue && template.mount(target, cacheAnchor);
    },
    update() {
      const newConditionValue = getCondition();
      if (newConditionValue !== conditionValue) {
        newConditionValue ? template.mount(cacheTarget, cacheAnchor) : template.destroy();
      } else {
        newConditionValue ? template.update() : template.destroy();
      }
      conditionValue = newConditionValue;
    },
    destroy: () => {
      template.destroy();
    },
  };
}