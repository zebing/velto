import type { Ref } from "./ref";
import { ComponentInstance, getCurrentInstance } from "../component";
import { enqueueScheduler, Scheduler } from "./scheduler";

export type Effect = () => void;

/**
 * WeakMap {
 *   ref1: Set[ComponentContext1, ComponentContext2]
 *   ref2: Set[ComponentContext1, ComponentContext2]
 * }
 */
const contextMap = new WeakMap<object, Set<ComponentInstance>>();

export function track(key: Ref) {
  const instance = getCurrentInstance();
  let dep = contextMap.get(key);

  if (!dep) {
    dep = new Set<ComponentInstance>();
    contextMap.set(key, dep);
  }

  if (instance && !dep.has(instance)) {
    dep.add(instance);
  }
}

export function trigger(key: Ref) {
  const dep = contextMap.get(key);

  dep?.forEach((instance) => {
    const schedule: Scheduler = () => instance?.update?.(key);
    schedule.id = instance.uid;
    enqueueScheduler(schedule);
  })
}