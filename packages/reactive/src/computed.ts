import { createDep } from "./dep";
import { Effect, EffectType } from "./effect";
import { activeEffect } from "./effect";
import { trackEffect, triggerEffect } from "./refEffect";
import { isFunction } from "@velto/shared";
import { ReactiveFlags } from "./constant";

export type ComputedGetter<T> = (oldValue?: T) => T;
export type ComputedSetter<T> = (newValue: T) => void;
export interface ComputedOptions<T> {
  get: ComputedGetter<T>;
  set: ComputedSetter<T>;
}

export class Computed<T = any> {
  public [ReactiveFlags.IS_COMPUTED] = true;
  public dep = createDep();
  private __value!: T;
  private dirty = true;
  private effect: EffectType;
  

  constructor(
    private getter: ComputedGetter<T>,
    private setter: ComputedSetter<T>
  ) {
    const scheduler = () => {
      this.dirty = true;
      triggerEffect(this, this.dep);
    };

    this.effect = new Effect(() => {
      this.__value = this.getter();
    }, scheduler);
  }

  public refreshValue () {
    this.effect.run();
    this.dirty = false
  }

  public get value() {
    if (this.dirty) {
      this.refreshValue();
    }
    trackEffect(activeEffect, this);
    return this.__value;
  }

  public setValue(newValue: T) {
    this.setter(newValue);
  }
}

export function computed<T>(getter: ComputedGetter<T>): Computed<T>;
export function computed<T>(options: ComputedOptions<T>): Computed<T>;
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | ComputedOptions<T>
) {
  let getter: ComputedGetter<T>;
  let setter: ComputedSetter<T>;

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
    setter = () => {};
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  return new Computed(getter, setter);
}
