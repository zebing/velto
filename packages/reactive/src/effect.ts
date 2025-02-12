import { Scheduler } from "./scheduler";
export type EffectType = Effect;
export let activeEffect: Effect | undefined;
export let shouldTrackEffect = false;

export class Effect {
  public active = true;

  constructor(
    public fn: () => void,
    public scheduler: Scheduler | null = null,
  ) {}
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

  destroy() {
    this.active = false;
    this.run();
  }
}
