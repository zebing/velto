import { track, trigger } from "./effect";

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
    console.log('+++++++set value')
    trigger(this);
  }
}

export function ref<T = any>(value: T): Ref<T> {
  return new Ref(value)
}