import { Reactive } from "./reactive";
export interface Template {
  mount: (target: Element, anchor?: Element) => void;
  update: (reactive: Reactive) => void;
  destroy: () => void;
}

export type UpdateHook = () => void;