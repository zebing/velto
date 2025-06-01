import { LifecycleHooks, callHook } from "./lifecycle";
import { Effect } from "@velto/reactive";
import type { Render, CompileTemplate, RefFunction } from "../types";
import { omit } from "@velto/shared";
import { setRef } from "../utils";

export * from "./lifecycle";

export type Component<T = Record<string, unknown>> = (init: T) => Render;
export type LifecycleHook<TFn = () => void> = TFn[] | null;

export interface Props {
  [key: string]: unknown,
};

export interface ComponentInstance {
  uid: number;
  type: Component;
  props: Props;
  template: CompileTemplate;
  target: Element;
  anchor?: Element;

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

export function getComponentInstance(type: Component, props: Props): ComponentInstance {
  return {
    uid: uid++,
    type,
    props,
    template: undefined!,
    target: undefined!,
    anchor: undefined,

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
}

export function component(type: Component, props: Props) {
  const componentProps = omit(props, ['ref']);
  let instance = getComponentInstance(type, componentProps);

  if (!!props.ref) {
    setRef(props.ref as RefFunction, instance)
  }

  const fn = () => {
    if (!instance.isMounted) {
      if (!instance.isCreated) {
        setCurrentInstance(instance);
        const render = instance.type(instance.props);
        instance.template = render();
        instance.isCreated = true;
        callHook(LifecycleHooks.CREATED, instance);
      }

      callHook(LifecycleHooks.BEFORE_MOUNT, instance);
      instance.template.mount(instance.target, instance.anchor);
      instance.isMounted = true;
      callHook(LifecycleHooks.MOUNTED, instance);

    } else {
      callHook(LifecycleHooks.BEFORE_UPDATE, instance);
      instance.template.update();
      callHook(LifecycleHooks.UPDATED, instance);
    }
  }
  const scheduler = () => {
    effect.trigger();
  }
  scheduler.id = instance.uid;
  const effect = new Effect(fn, scheduler);

  return {
    mount(target: Element, anchor?: Element) {
      instance.target = target;
      instance.anchor = anchor;
      effect.trigger();
    },

    destroy() {
      if (instance.isCreated) {
        callHook(LifecycleHooks.BEFORE_DESTROY, instance);
        instance.template.destroy();
        instance = {
          ...getComponentInstance(type, instance.props),
          target: instance.target,
          anchor: instance.target,
        }
        callHook(LifecycleHooks.DESTROYED, instance);
      }
    }
  }
}

export let currentInstance: ComponentInstance | null = null;

export const setCurrentInstance = (instance: ComponentInstance) => {
  currentInstance = instance
}
