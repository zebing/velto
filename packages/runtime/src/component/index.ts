import { LifecycleHooks, callHook } from "./lifecycle";
import { Effect } from "@lite/reactive";
import type { Render, CompileTemplate } from "../types";

export * from "./lifecycle";

export type Component = (init: Record<string, unknown>) => Render;
export type LifecycleHook<TFn = () => void> = TFn[] | null;

export interface Props {
  [key: string]: unknown,
};

export interface ComponentInstance {
  uid: number;
  type: Component;
  props: Props;
  template: CompileTemplate;

  // lifecycle
  isCreated: boolean;
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
    template: undefined!,

    isCreated: false,
    isMounted: false,
    [LifecycleHooks.CREATED]: null,
    [LifecycleHooks.BEFORE_MOUNT]: null,
    [LifecycleHooks.MOUNTED]: null,
    [LifecycleHooks.BEFORE_UPDATE]: null,
    [LifecycleHooks.UPDATED]: null,
    [LifecycleHooks.BEFORE_DESTROY]: null,
    [LifecycleHooks.DESTROYED]: null,
  };

  const update = () => {
    callHook(LifecycleHooks.BEFORE_UPDATE, instance);
    instance.template.update();
    callHook(LifecycleHooks.UPDATED, instance);
  }

  const effect = new Effect(update, instance.uid);

  effect.run(() => {
    setCurrentInstance(instance);
    const render = instance.type(instance.props);
    instance.template = render();
    callHook(LifecycleHooks.CREATED, instance);
  });

  return {
    mount(target: Element, anchor?: Element) {
      effect.run(() => {
        callHook(LifecycleHooks.BEFORE_MOUNT, instance);
        instance.template.mount(target, anchor);
        instance.isMounted = true;
        callHook(LifecycleHooks.MOUNTED, instance);
      });
    },

    update() {
      effect.run(update);
    },

    destroy() {
      effect.run(() => {
        callHook(LifecycleHooks.BEFORE_DESTROY, instance);
        instance.template.destroy();
        callHook(LifecycleHooks.DESTROYED, instance);
      });
    }
  }
}

export let currentInstance: ComponentInstance | null = null;

export const setCurrentInstance = (instance: ComponentInstance) => {
  currentInstance = instance
}
