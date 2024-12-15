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
export class RuntimeRef<T = any> {
  public __isRef = true;
  private _value: T;
  public dep = createDep();

  constructor(value: T) {
    this._value = ProxyArray(value, this);
  }

  get value() {
    trackEffect(activeEffect, this.dep);
    return this._value;
  }

  set value(newVal) {
    this._value = ProxyArray(newVal, this);
    triggerEffect(this, this.dep);
  }
}

export function runtimeRef<T extends RuntimeRef<T>>(value: T): RuntimeRef<T> {
  if ((value as RuntimeRef)?.__isRef) {
    return value;
  }
  return new RuntimeRef(value)
}

export function ref<T = any>(value: T): T {
  return value;
}