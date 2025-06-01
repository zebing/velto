import { Reactive } from "./types";
import { Scheduler } from "./scheduler";
import { EffectFlags } from "./constant";


export type EffectType = Effect;
export let activeEffect: Effect | undefined;
export let shouldTrackEffect = false;

export class Effect {
  public dep = new Set<Reactive>();
  public flag: EffectFlags = EffectFlags.Normal;
  constructor(
    public fn: () => void,
    public scheduler: Scheduler,
    public recycle = false,
  ) {
    this.flag = recycle ? EffectFlags.Recycle : EffectFlags.Normal;
  }

  public run() {
    let lastShouldTrack = shouldTrackEffect;
    let lastEffect = activeEffect;

    try {
      shouldTrackEffect = true;
      activeEffect = this as unknown as Effect;
      return this.fn();
    } finally {
      activeEffect = lastEffect;
      shouldTrackEffect = lastShouldTrack;
    }
  }

  public trigger() {
    this.run();
  }

  destroy() {
    this.dep.forEach((reactive) => reactive.dep.delete(this));
  }
}
