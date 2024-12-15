import { LifecycleHooks } from "./lifecycle";
import { Reactive, ComponentEffect } from "../reactive";

export * from "./lifecycle";
export interface RenderResult {
  [key: symbol]: boolean;
  mount: (target: Element, anchor?: Element) => void;
  update: (ref: Reactive) => void;
  destroy: () => void;
}
export type Component = (init: Record<string, unknown>, ctx: Record<string, unknown>) => RenderResult;
export type LifecycleHook<TFn = () => void> = TFn[] | null;

export interface Props {
  [key: string]: unknown,
};

export interface ComponentInstance {
  uid: number;
  type: Component;
  props: Props;
  // Prevents duplicate updates for parent-child components when both components introduce the same ref.
  updatedWithRefs: Reactive[],

  // lifecycle
  isMounted: boolean;
  [LifecycleHooks.CREATED]: LifecycleHook;
  [LifecycleHooks.BEFORE_MOUNT]: LifecycleHook;
  [LifecycleHooks.MOUNTED]: LifecycleHook;
  [LifecycleHooks.BEFORE_UPDATE]: LifecycleHook;
  [LifecycleHooks.UPDATED]: LifecycleHook;
  [LifecycleHooks.BEFORE_DESTROY]: LifecycleHook;
  [LifecycleHooks.DESTROYED]: LifecycleHook;
}


let uid = 0

export function buildComponent(type: Component, props: Props) {
  const instance: ComponentInstance = {
    uid: uid++,
    type,
    props,
    updatedWithRefs: [],

    isMounted: false,
    [LifecycleHooks.CREATED]: null,
    [LifecycleHooks.BEFORE_MOUNT]: null,
    [LifecycleHooks.MOUNTED]: null,
    [LifecycleHooks.BEFORE_UPDATE]: null,
    [LifecycleHooks.UPDATED]: null,
    [LifecycleHooks.BEFORE_DESTROY]: null,
    [LifecycleHooks.DESTROYED]: null,
  };

  const componentEffect = new ComponentEffect(instance);

  return componentEffect
}

export let currentInstance: ComponentInstance | null = null;

export const setCurrentInstance = (instance: ComponentInstance) => {
  currentInstance = instance
}
