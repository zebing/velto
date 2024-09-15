import { track, trigger } from "./effect";

export type Ref = RuntimeRef<any> | Record<any, any>;

export class RuntimeRef<T = any> {
  private _value: T;
  public __isRef = true;

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

export function runtimeRef<T = any>(value: T): RuntimeRef<T>{
  return new RuntimeRef(value);
}

export function ref<T = any>(value: T): T{
  return value;
}