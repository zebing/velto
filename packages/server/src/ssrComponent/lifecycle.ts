import { isArray, callUnstableFunc } from "@velto/shared";
import type { ComponentInstance } from "..";
import { currentInstance } from "..";

export enum LifecycleHooks {
  CREATED = 'created',
  BEFORE_MOUNT = 'beforeMount',
  MOUNTED = 'mounted',
  BEFORE_UPDATE = 'beforeUpdate',
  UPDATED = 'updated',
  BEFORE_DESTROY = 'beforeDestroy',
  DESTROYED = 'destroyed',
}

export const createHook = (lifecycle: LifecycleHooks) => (hook: () => any, instance = currentInstance) => {
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
export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT);
export const onMounted = createHook(LifecycleHooks.MOUNTED);
export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE);
export const onUpdated = createHook(LifecycleHooks.UPDATED);
export const onBeforeDestroy = createHook(LifecycleHooks.BEFORE_DESTROY);
export const onDestroyed = createHook(LifecycleHooks.DESTROYED);
