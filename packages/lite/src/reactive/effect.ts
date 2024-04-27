import type { Ref } from "./ref";
import { ComponentInstance, getCurrentInstance } from "../";

export type Effect = () => void;

/**
 * WeakMap {
 *   name1: Set[ComponentContext1, ComponentContext2]
 *   name2: Set[ComponentContext1, ComponentContext2]
 * }
 */
const contextMap = new WeakMap<object, Set<ComponentInstance>>();

export function track(key: Ref<any>) {
  const instance = getCurrentInstance();
  let dep = contextMap.get(key);

  if (!dep) {
    dep = new Set<ComponentInstance>();
    contextMap.set(key, dep);
  }

  if (instance) {
    dep.add(instance);
  }
}

export function trigger(key: Ref<any>) {
  const dep = contextMap.get(key);
  dep?.forEach((instance) => instance?.renderEffect?.())
}