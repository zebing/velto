import type { Ref } from "./ref";
import { ComponentInstance, currentInstance } from "../component";
import { enqueueScheduler, Scheduler } from "./scheduler";

/**
 * WeakMap {
 *   ref1: Set[ComponentInstance, ComponentInstance]
 *   ref2: Set[ComponentInstance, ComponentInstance]
 * }
 */
const contextMap = new WeakMap<object, Set<ComponentInstance>>();

export function track(key: Ref) {
  let effectList = contextMap.get(key);

  if (!effectList) {
    effectList = new Set<ComponentInstance>();
    contextMap.set(key, effectList);
  }

  if (currentInstance && !effectList.has(currentInstance)) {
    effectList.add(currentInstance);
  }
}

export function trigger(key: Ref) {
  const effectList = contextMap.get(key);

  effectList?.forEach((instance) => {
    const schedule: Scheduler = () => {
      if (!instance.updatedWithRefs.includes(key)) {
        instance?.update?.(key);
      }
      
      instance.updatedWithRefs.length = 0;
    }
    schedule.id = instance?.uid || 0;
    schedule.ref = key;
    enqueueScheduler(schedule);
  })
}