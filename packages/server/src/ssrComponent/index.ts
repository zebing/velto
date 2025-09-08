import { LifecycleHooks, callHook } from "./lifecycle";
import type { SSRRender, RefFunction } from "../types";
import { omit } from "@velto/shared";
import { setRef } from "../utils";

export * from "./lifecycle";

export type Component<T = Record<string, unknown>> = (init: T) => SSRRender;
export type LifecycleHook<TFn = () => void> = TFn[] | null;

export interface Props {
  [key: string]: unknown,
};

export interface ComponentInstance {
  uid: number;
  type: Component;
  props: Props;
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

export function ssrComponent(type: Component, props: Props) {
  const componentProps = omit(props, ['ref']);
  let instance = getComponentInstance(type, componentProps);

  if (!!props.ref) {
    setRef(props.ref as RefFunction, instance)
  }

  setCurrentInstance(instance);
  const render = instance.type(instance.props);
  instance.isCreated = true;
  callHook(LifecycleHooks.CREATED, instance);


  return render;
}

export let currentInstance: ComponentInstance | null = null;

export const setCurrentInstance = (instance: ComponentInstance) => {
  currentInstance = instance
}
