export interface Template {
  mount: (target: Element, anchor?: Element | Text) => void;
  update: () => void;
  destroy: () => void;
}

export type RenderFN = () => Template;

export interface Render extends RenderFN { __isRender: boolean; }

export type Component<T = Record<string, unknown>> = (init: T) => Render;
export type LifecycleHook<TFn = () => void> = TFn[] | null;
