import type { ComponentContext } from "./componentContext";
import { getComponentContext } from "./componentContext";
import { isArray, callUnstableFunc } from "../../utils";

export const enum LifecycleHooks {
  // BEFORE_RENDER = 'beforeRender',
  RENDERED = 'rendered',
  BEFORE_UPDATE = 'beforeUpdate',
  UPDATED = 'updated',
  UNMOUNTED = 'unMounted',
}

export const createHook = (lifecycle: LifecycleHooks) => (hook: () => any) => {
  const target = getComponentContext();
  if (!target) {
    return;
  }

  if (!isArray(target[lifecycle])) {
    target[lifecycle] = [];
  }

  target[lifecycle]?.push(hook);
}

export const callHook = (lifecycle: LifecycleHooks, target: ComponentContext) => {
  const hook = target?.[lifecycle];

  if (!hook) {
    return ;
  }

  if (isArray(hook)) {
    hook.forEach((h) => callUnstableFunc(h));
  } else {
    callUnstableFunc(hook);
  }
}

export const createAndCallHook = (hook: () => any) => {
  callUnstableFunc(hook);
}


export const onBeforeRender = createAndCallHook;
export const onRendered = createHook(LifecycleHooks.RENDERED);
export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE);
export const onUpdated = createHook(LifecycleHooks.UPDATED);
export const onUnmounted = createHook(LifecycleHooks.UNMOUNTED);
