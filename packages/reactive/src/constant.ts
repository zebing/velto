export enum ReactiveFlags {
  IS_REF = '__isRef',
  IS_COMPUTED = '__isComputed',
}

export enum EffectFlags {
  Normal = 1,
  Recycle = 2,
}