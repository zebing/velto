import { LifecycleHooks, callHook } from "./lifecycle";
import { Style } from "../propsOps";
import { callUnstableFunc, hash } from "../../utils";
import { Effect } from "../../";

export * from "./lifecycle";
export type Component = (init: Record<string, unknown>, ctx: Record<string, unknown>) => Element | Text | null;
export type RenderFunction = (container: Element) => void;
export type LifecycleHook<TFn = () => void> = TFn[] | null;

export interface Props {
  name?: string;
  style?: Style;
  [key: string]: unknown,
};

export interface ComponentInstance {
  hash: string;
  uid: number;
  type: Component;
  parent: ComponentInstance | null;
  subComponentInstance: ComponentInstance[];
  effectList: Effect[],
  render: RenderFunction | null;
  renderEffect: (() => void) | null;

  // lifecycle
  isCreated: boolean;
  isMounted: boolean;
  [LifecycleHooks.CREATED]: LifecycleHook;
  [LifecycleHooks.BEFORE_RENDER]: LifecycleHook;
  [LifecycleHooks.RENDERED]: LifecycleHook;
  [LifecycleHooks.BEFORE_UPDATE]: LifecycleHook;
  [LifecycleHooks.UPDATED]: LifecycleHook;
  [LifecycleHooks.BEFORE_UNMOUNT]: LifecycleHook;
  [LifecycleHooks.UNMOUNTED]: LifecycleHook;
}


let uid = 0

export function createComponentInstance(type: Component) {
  const parent = getCurrentInstance();
  const instance: ComponentInstance = {
    hash: '',
    uid: uid++,
    type,
    parent,
    subComponentInstance: [],
    effectList: [],
    render: null,
    renderEffect: null,

    isCreated: false,
    isMounted: false,
    [LifecycleHooks.CREATED]: null,
    [LifecycleHooks.BEFORE_RENDER]: null,
    [LifecycleHooks.RENDERED]: null,
    [LifecycleHooks.BEFORE_UPDATE]: null,
    [LifecycleHooks.UPDATED]: null,
    [LifecycleHooks.BEFORE_UNMOUNT]: null,
    [LifecycleHooks.UNMOUNTED]: null,
  }

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

export function renderComponent(container: Element, instance: ComponentInstance, props?: Props) {
  instance.renderEffect = () => renderEffect(container, instance, props);
  instance.renderEffect();
}

export function renderEffect(container: Element, instance: ComponentInstance, props?: Props) {
  pushCurrentInstance(instance);
  if (!instance.isCreated) {
    instance.render = callUnstableFunc(instance.type, [props]);
    instance.isCreated = true;

    // created hook
    callHook(LifecycleHooks.CREATED, instance);
  }

  container.innerHTML = '';
  // mounte
  if (!instance.isMounted) {
    // beforeRender hook
    callHook(LifecycleHooks.BEFORE_RENDER, instance);
    instance?.render?.(container);
    // rendered hook
    callHook(LifecycleHooks.RENDERED, instance);
    return;
  }
  
  instance.hash = hash();

  // update
  // beforeRender hook
  callHook(LifecycleHooks.BEFORE_UPDATE, instance);
  instance?.effectList.forEach(effect => effect());
  instance?.render?.(container);
  // rendered hook
  callHook(LifecycleHooks.UPDATED, instance);

  popCurrentInstance();

  const unMountComponentInstances = instance.subComponentInstance.filter(subInstance => 
    subInstance.hash !== instance.hash);
  
  if (unMountComponentInstances.length) {
    unMountComponentInstances.forEach(instance => unMountComponent(instance));
  }

  if (instance.parent?.hash) {
    instance.hash = instance.parent.hash;
  }
}

export function unMountComponent(instance: ComponentInstance) {
  // beforeUnmount hook
  callHook(LifecycleHooks.BEFORE_UNMOUNT, instance);

  Object.assign(instance, createComponentInstance(instance.type));

  // unmounted hook
  callHook(LifecycleHooks.UNMOUNTED, instance);
}
