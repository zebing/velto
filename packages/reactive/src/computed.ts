import { createDep } from "./dep";
import { Effect } from "./effect";
import { activeEffect } from "./effect";
import { trackEffect, triggerEffect } from "./refEffect";
import { isFunction } from "./utils";
import { ReactiveFlags } from "./constant";

export type ComputedGetter<T> = (oldValue?: T) => T;
export type ComputedSetter<T> = (newValue: T) => void;
export interface ComputedOptions<T> {
  get: ComputedGetter<T>;
  set: ComputedSetter<T>;
}

export class Computed<T = any> {
  public dep = createDep();
  private __value!: T;
  public [ReactiveFlags.IS_COMPUTED] = true;

  constructor(
    private getter: ComputedGetter<T>,
    private setter: ComputedSetter<T>
  ) {
    const effect = new Effect(() => {
      this.__value = this.getter();
    });

    const scheduler = () => {
      const value = this.getter();
      if (value !== this.__value) {
        this.__value = value;
        triggerEffect(this, this.dep);
      }
    };
    scheduler.id = 0;
    effect.scheduler = scheduler;

    effect.run();
  }

  public get value() {
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
