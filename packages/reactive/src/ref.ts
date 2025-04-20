import { activeEffect } from "./effect";
import { trackEffect, triggerEffect } from "./refEffect";
import { createDep } from "./dep";
import { Reactive } from "./types";
import { ReactiveFlags } from "./constant";

export class Ref<T = any> {
  public [ReactiveFlags.IS_REF] = true;
  private _value: T;
  public dep = createDep();

  constructor(value: T) {
    this._value = value;
  }

  public get value() {
    trackEffect(activeEffect, this);
    return this._value;
  }

  public setValue(newVal: T) {
    this._value = newVal;
    triggerEffect(this, this.dep);
  }
}

export function ref<T>(value: T): Ref<T> {
  return new Ref(value)
}