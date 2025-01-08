export interface Template {
  [key: symbol]: boolean;
  render: (target: Element, anchor?: Element) => void;
  destroy: () => void;
}

export type UpdateHook = () => void;