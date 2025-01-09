import type { Reactive } from "./types";
import { enqueueScheduler, Scheduler } from "./scheduler";
import { EffectType } from "./effect";
import { Dep } from "./dep";

export function trackEffect(activeEffect: EffectType | undefined, reactive: Reactive) {
  const dep: Dep = reactive.dep;
  if (activeEffect) {
    dep.add(activeEffect);
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