import { LifecycleHooks, callHook } from "./lifecycle";
// import { Style } from "./propsOps";
import { callUnstableFunc, hash } from "../utils";
import { Ref } from "../ref";

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
    updatedWithRefs: [],
    renderResult: {
      mount: () => undefined,
      update: () => undefined,
      destroy: () => undefined,
    },
    mount: (target, anchor) => {
      pushCurrentInstance(instance);
      callHook(LifecycleHooks.BEFORE_MOUNT, instance);
      instance.renderResult.mount(target, anchor);
      callHook(LifecycleHooks.MOUNTED, instance);
      popCurrentInstance();
    },
    update: (ref) => {
      instance.updatedWithRefs.push(ref);
      pushCurrentInstance(instance);
      callHook(LifecycleHooks.BEFORE_UPDATE, instance);
      instance.renderResult.update(ref);
      callHook(LifecycleHooks.UPDATED, instance);
      popCurrentInstance();
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
  }

  pushCurrentInstance(instance);
  const render = callUnstableFunc<Component, () => RenderResult>(type, [props]);
  if (render) {
    instance.renderResult = render();

    // created hook
    callHook(LifecycleHooks.CREATED, instance);
  }
  popCurrentInstance();
  

  return instance
}

export let currentInstance: ComponentInstance | null = null;
const currentInstances: ComponentInstance[] = [];

export const getCurrentInstance: () => ComponentInstance | null = () => currentInstance;

export const pushCurrentInstance = (instance: ComponentInstance) => {
  if (currentInstance) {
    currentInstances.push(instance);
  }

  currentInstance = instance;
}

export const popCurrentInstance = () => {
  currentInstance = currentInstances.pop() || null;
}

// export function renderComponent(container: Element, instance: ComponentInstance, props?: Props) {
//   instance.renderEffect = () => renderEffect(container, instance, props);
//   instance.renderEffect();
// }

// export function renderEffect(container: Element, instance: ComponentInstance, props?: Props) {
//   pushCurrentInstance(instance);
//   if (!instance.isCreated) {
//     instance.render = callUnstableFunc(instance.type, [props]);
//     instance.isCreated = true;

//     // created hook
//     callHook(LifecycleHooks.CREATED, instance);
//   }

//   container.innerHTML = '';
//   // mounte
//   if (!instance.isMounted) {
//     // beforeRender hook
//     callHook(LifecycleHooks.BEFORE_RENDER, instance);
//     instance?.render?.(container);
//     // rendered hook
//     callHook(LifecycleHooks.RENDERED, instance);
//     return;
//   }
  
//   instance.hash = hash();

//   // update
//   // beforeRender hook
//   callHook(LifecycleHooks.BEFORE_UPDATE, instance);
//   instance?.effectList.forEach(effect => effect());
//   instance?.render?.(container);
//   // rendered hook
//   callHook(LifecycleHooks.UPDATED, instance);

//   popCurrentInstance();

//   const unMountComponentInstances = instance.subComponentInstance.filter(subInstance => 
//     subInstance.hash !== instance.hash);
  
//   if (unMountComponentInstances.length) {
//     unMountComponentInstances.forEach(instance => unMountComponent(instance));
//   }

//   if (instance.parent?.hash) {
//     instance.hash = instance.parent.hash;
//   }
// }

// export function unMountComponent(instance: ComponentInstance) {
//   // beforeUnmount hook
//   callHook(LifecycleHooks.BEFORE_UNMOUNT, instance);

//   Object.assign(instance, createComponentInstance(instance.type));

//   // unmounted hook
//   callHook(LifecycleHooks.UNMOUNTED, instance);
// }
