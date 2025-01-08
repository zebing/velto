import type { Template } from "../types";
import { setActiveUpdate, deleteUpdate } from "../reactive";

export function condition(template: Template, getCondition: () => boolean): Template {
  let update;
  return {
    render: (target: Element, anchor?: Element) => {
      update = () => {
        getCondition() ? template.render(target, anchor) : template.destroy();
      }
      setActiveUpdate(update);
    },
    destroy: () => {
      template.destroy();
      deleteUpdate(update!);
    },
  }
}