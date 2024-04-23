import { track, trigger } from "./effect";

export type Effect = () => any;

export class Ref<T> {
  private _value: T

  constructor(value: T) {
    this._value = value;
  }

  get value() {
    track(this);
    return this._value;
  }

  set value(newVal) {
    this._value = newVal;
    trigger(this);
  }
}

export function ref<T = any>(value: T): Ref<T | undefined> {
  return new Ref(value)
}