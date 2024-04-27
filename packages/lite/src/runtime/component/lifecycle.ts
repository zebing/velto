import { isArray, callUnstableFunc } from "../../utils";
import type { ComponentInstance } from "./";
import { getCurrentInstance } from "./";

export const enum LifecycleHooks {
  CREATED = 'created',
  BEFORE_RENDER = 'beforeRender',
  RENDERED = 'rendered',
  BEFORE_UPDATE = 'beforeUpdate',
  UPDATED = 'updated',
  BEFORE_UNMOUNT = 'beforeUnmount',
  UNMOUNTED = 'unMounted',
}

export const createHook = (lifecycle: LifecycleHooks) => (hook: () => any) => {
  const instance = getCurrentInstance();
  if (!instance) {
    return;
  }

  if (!isArray(instance[lifecycle])) {
    instance[lifecycle] = [];
  }

  instance[lifecycle]?.push(hook);
}

export const callHook = (lifecycle: LifecycleHooks, instance: ComponentInstance) => {
  const hook = instance?.[lifecycle];

  if (!hook) {
    return ;
  }

  if (isArray(hook)) {
    hook.forEach((h) => callUnstableFunc(h));
  } else {
    callUnstableFunc(hook);
  }
}

export const onCreated = createHook(LifecycleHooks.CREATED);
export const onBeforeRender = createHook(LifecycleHooks.BEFORE_RENDER);
export const onRendered = createHook(LifecycleHooks.RENDERED);
export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE);
export const onUpdated = createHook(LifecycleHooks.UPDATED);
export const onBeforeUnMount = createHook(LifecycleHooks.BEFORE_UNMOUNT);
export const onUnMounted = createHook(LifecycleHooks.UNMOUNTED);
