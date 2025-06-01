import type { Reactive } from "./types";
import { enqueueScheduler } from "./scheduler";
import { EffectType } from "./effect";
import { Dep } from "./dep"; 
import { EffectFlags } from "./constant";

export function trackEffect(activeEffect: EffectType | undefined, reactive: Reactive) {
  const dep: Dep = reactive.dep;
  if (activeEffect) {
    dep.add(activeEffect);

    // Need Recycle
    if (activeEffect.flag === EffectFlags.Recycle) {
      activeEffect.dep.add(reactive);
    }
  }
}

export function triggerEffect(key: Reactive, dep: Dep) {
  dep?.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler.ref = key;
      enqueueScheduler(effect.scheduler);
    }
  });
}