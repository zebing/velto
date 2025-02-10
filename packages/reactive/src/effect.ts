export type EffectType = Effect;
export let activeEffect: Effect | undefined;
export let shouldTrackEffect = false;


export class Effect {
  constructor(
    public update: () => void,
    public uid: number,
  ) {}
  public run(fn: () => void) {
    let lastShouldTrack = shouldTrackEffect;
    let lastEffect = activeEffect;
    try {
      shouldTrackEffect = true;
      activeEffect = this as unknown as Effect;
      return fn?.();
    } finally {
      activeEffect = lastEffect;
      shouldTrackEffect = lastShouldTrack;
    }
  }
}
