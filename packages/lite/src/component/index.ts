import { LifecycleHooks } from "./lifecycle";
import { ComponentEffect } from "../reactive";
import type { Render } from "../types";

export * from "./lifecycle";

export type Component = (init: Record<string, unknown>, ctx: Record<string, unknown>) => Render;
export type LifecycleHook<TFn = () => void> = TFn[] | null;

export interface Props {
  [key: string]: unknown,
};

export interface ComponentInstance {
  uid: number;
  type: Component;
  props: Props;

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

    isMounted: false,
    [LifecycleHooks.CREATED]: null,
    [LifecycleHooks.BEFORE_MOUNT]: null,
    [LifecycleHooks.MOUNTED]: null,
    [LifecycleHooks.BEFORE_UPDATE]: null,
    [LifecycleHooks.UPDATED]: null,
    [LifecycleHooks.BEFORE_DESTROY]: null,
    [LifecycleHooks.DESTROYED]: null,
  };

  return new ComponentEffect(instance);
}

export let currentInstance: ComponentInstance | null = null;

export const setCurrentInstance = (instance: ComponentInstance) => {
  currentInstance = instance
}
