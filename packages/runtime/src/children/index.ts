
import type { Template } from "../types";

export function children(childList: Template[]): Template {
  return {
    mount: (target: Element, anchor?: Element | Text) => {
      childList.forEach((child) => child.mount(target, anchor));
    },
    update() {
      childList.forEach((child) => child.update());
    },
    destroy: () => {
      childList.forEach((child) => child.destroy());
    },
  };
}