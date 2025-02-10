import { activeEffect } from "./effect";
import { trackEffect, triggerEffect } from "./refEffect";
import { createDep } from "./dep";
import { Reactive } from "./types";

const arrayProxyFunctionNames = ['push', 'pop', 'shift', 'unshift', 'splice'];
function ProxyArray<T = any>(value: T, reactive: Reactive) {
  if (Array.isArray(value)) {
    return new Proxy(value, {
      get(target, prop, receiver) {
        if (arrayProxyFunctionNames.includes(prop as string)) {
          return function (...args: unknown[]) {
            // @ts-ignore
            const result = target[prop](...args);
            triggerEffect(reactive, reactive.dep);
            return result;
          }
        }
        
        return target[prop as unknown as number];
      }
    })
  }

  return value;
}
export class Ref<T = any> {
  public __isRef = true;
  private _value: T;
  public dep = createDep();

  constructor(value: T) {
    this._value = ProxyArray(value, this);
  }

  public get value() {
    trackEffect(activeEffect, this);
    return this._value;
  }

  public setValue(newVal: T) {
    this._value = ProxyArray(newVal, this);
    triggerEffect(this, this.dep);
  }
}

export function ref<T>(value: T): Ref<T> {
  return new Ref(value)
}