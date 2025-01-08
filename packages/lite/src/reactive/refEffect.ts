import type { Reactive } from "./types";
import { enqueueScheduler, Scheduler } from "./scheduler";
import { EffectType, activeUpdate, shouldTrackUpdate } from "./effect";
import { Dep } from "./dep";

export function trackEffect(activeEffect: EffectType | undefined, reactive: Reactive) {
  const dep: Dep = reactive.dep;
  if (activeEffect) {
    dep.add(activeEffect);

    if (activeUpdate) {
      let updateMap = activeEffect.instance.updateMap.get(reactive);

      if (!updateMap) {
        activeEffect.instance.updateMap.set(reactive, updateMap = new Map());
      }

      if (!updateMap.has(activeUpdate)) {
        updateMap.set(activeUpdate, activeUpdate);
      }
    }
  }
}

export function triggerEffect(key: Reactive, dep: Dep) {
  dep?.forEach((effect) => {
    const instance = effect.instance;
    const schedule: Scheduler = () => {
      effect?.update?.(key);
    }
    schedule.id = instance?.uid || 0;
    schedule.ref = key;
    enqueueScheduler(schedule);
  })
}