import { isObject, isArray } from "../utils";
import { track, trigger } from "./effect";

export type Ref = RefImpl<any> | Record<any, any>;

export class RefImpl<T = any> {
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

const handler: ProxyHandler<any> = {
  get(target, prop, receiver) {
    if (prop === '__isRef') {
      return true;
    }
    track(receiver);
    return target[prop];
  },
  set(target, prop, value, receiver) {
    target[prop] = value;

    if(isArray(target)) {
      if (prop === 'length') {
        trigger(receiver);
      }
      return true;
      
    } else {
      trigger(receiver);
    }
    return true;
  }
}

export function ref<T extends object = Record<any, any>>(value: T): T;
export function ref<T = any>(value: T): RefImpl<T>;
export function ref(value: any) {
  if (isObject(value)) {
    if (value.__isRef) {
      return value;
    }
    return new Proxy(value, handler);
  }

  return new RefImpl(value)
}