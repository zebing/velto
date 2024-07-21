import { LifecycleHooks, callHook } from "./lifecycle";
// import { Style } from "./propsOps";
import { callUnstableFunc, hash } from "../utils";
import { Ref } from "../reactive";

export * from "./lifecycle";
export interface RenderResult {
  mount: (target: Element, anchor?: Element) => void;
  update: (ref: Ref) => void;
  destroy: () => void;
}
export type Component = (init: Record<string, unknown>, ctx: Record<string, unknown>) => () => RenderResult;
export type LifecycleHook<TFn = () => void> = TFn[] | null;

export interface Props {
  [key: string]: unknown,
};

export interface ComponentInstance {
  uid: number;
  type: Component;
  props: Props;
  // Prevents duplicate updates for parent-child components when both components introduce the same ref.
  updatedWithRefs: Ref[],
  renderResult: RenderResult;
  mount: (target: Element, anchor?: Element) => void;
  update: (ref: Ref) => void;
  destroy: () => void;

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
    renderResult: {
      mount: () => undefined,
      update: () => undefined,
      destroy: () => undefined,
    },
    mount: (target, anchor) => {
      setCurrentInstance(instance);
      callHook(LifecycleHooks.BEFORE_MOUNT, instance);
      instance.renderResult.mount(target, anchor);
      callHook(LifecycleHooks.MOUNTED, instance);
    },
    update: (ref) => {
      setCurrentInstance(instance);
      instance.updatedWithRefs.push(ref);
      callHook(LifecycleHooks.BEFORE_UPDATE, instance);
      instance.renderResult.update(ref);
      callHook(LifecycleHooks.UPDATED, instance);
    },
    destroy: () => {
      callHook(LifecycleHooks.BEFORE_DESTROY, instance);
      instance.renderResult.destroy();
      callHook(LifecycleHooks.DESTROYED, instance);
    },

    isMounted: false,
    [LifecycleHooks.CREATED]: null,
    [LifecycleHooks.BEFORE_MOUNT]: null,
    [LifecycleHooks.MOUNTED]: null,
    [LifecycleHooks.BEFORE_UPDATE]: null,
    [LifecycleHooks.UPDATED]: null,
    [LifecycleHooks.BEFORE_DESTROY]: null,
    [LifecycleHooks.DESTROYED]: null,
  };

  setCurrentInstance(instance);
  const render = callUnstableFunc<Component, () => RenderResult>(type, [props]);

  if (render) {
    instance.renderResult = render();

    // created hook
    callHook(LifecycleHooks.CREATED, instance);
  }

  return instance
}

export let currentInstance: ComponentInstance | null = null;

export const setCurrentInstance = (instance: ComponentInstance) => {
  currentInstance = instance
}
