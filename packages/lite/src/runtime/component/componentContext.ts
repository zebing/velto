import { LifecycleHooks } from "./lifecycle";
import { Effect } from "../../reactive";

type LifecycleHook<TFn = Function> = TFn[] | null

export interface ComponentContext {
  effects: Effect[];
  subComponents: ComponentContext[];

  [LifecycleHooks.RENDERED]: LifecycleHook;
  [LifecycleHooks.BEFORE_UPDATE]: LifecycleHook;
  [LifecycleHooks.UPDATED]: LifecycleHook;
  [LifecycleHooks.UNMOUNTED]: LifecycleHook;
}

let currentComponentContext: ComponentContext | null = null;
const currentComponentContextList: ComponentContext[] = [];


export function pushComponentContext(target: ComponentContext) {
  if (currentComponentContext) {
    currentComponentContextList.push(currentComponentContext);
  }
  currentComponentContext = target;
}

export function popComponentContext() {
  const ctx = currentComponentContextList.pop();
  if (ctx) {
    currentComponentContext = ctx;
  }
  // currentComponentContext = currentComponentContextList.pop() ?? null;
}

export function getComponentContext(): ComponentContext | null {
  return currentComponentContext;
}

export function createComponentcomponentContext(): ComponentContext {
  return {
    effects: [],
    subComponents: [],
    [LifecycleHooks.RENDERED]: null,
    [LifecycleHooks.BEFORE_UPDATE]: null,
    [LifecycleHooks.UPDATED]: null,
    [LifecycleHooks.UNMOUNTED]: null,
  }
}