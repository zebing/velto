import { LifecycleHooks } from "./lifecycle";
import { Reactive, ComponentEffect } from "../reactive";
import type { Template, UpdateHook } from "../types";

export * from "./lifecycle";

export type Component = (init: Record<string, unknown>, ctx: Record<string, unknown>) => Template;
export type LifecycleHook<TFn = () => void> = TFn[] | null;

export interface Props {
  [key: string]: unknown,
};

export interface ComponentInstance {
  uid: number;
  type: Component;
  props: Props;
  updateMap: Map<Reactive, Map<UpdateHook, UpdateHook>>;

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

export function component(type: Component, props: Props) {
  const instance: ComponentInstance = {
    uid: uid++,
    type,
    props,
    updateMap: new Map(),

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
