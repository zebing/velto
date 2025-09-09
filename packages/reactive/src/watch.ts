import { Reactive } from "./types";
import { isReactive } from "./utils";
import { Effect } from "./effect";
import { isFunction } from "@velto/shared";

export type WatchSource<T = any> = Reactive<T>;
export type WatchSourceFn<T = any> = () => T;
export type WatchCallback<T = any, V = any> = (value: T, oldValue: V) => any;
export interface WatchOptions {
  immediate?: boolean;
  once?: boolean;
}
export type WatchStopHandle = {
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function watch(
  source: WatchSource | WatchSource[] | WatchSourceFn,
  cb?: WatchCallback | null,
  options: WatchOptions = {}
): WatchStopHandle {
  const { immediate, once } = options;

  let getter: () => any;
  let oldValue: any;
  let pause = false;

  if (isReactive(source)) {
    getter = () => (source as WatchSource).value;
  } else if (Array.isArray(source)) {
    getter = () => (source as WatchSource[]).map((s) => s.value);
  } else if (isFunction(source)) {
    getter = source;
  } else {
    getter = () => undefined;
  }

  const isEqual = (a: unknown, b: unknown) => {
    if (Array.isArray(source)) {
      return (a as Array<unknown>).every((value: unknown, index: number) => 
        value === (b as Array<unknown>)[index]
      );
    }
    return a === b;
  }

  const scheduler = () => {
    const value = effect.run();
    console.log('+++++', value)
    if (pause || isEqual(value, oldValue)) {
      return;
    }
    const cacheOldValue = oldValue;
    oldValue = value;
    try {
      cb?.(value, cacheOldValue);
    } catch(err) {}
  };
  const effect = new Effect(getter, scheduler, true);
  oldValue = effect.run();

  const watchHandle = {
    pause: () => pause = true,
    resume: () => pause = false,
    stop: () => {
      effect.destroy();
    },
  }

  if (cb) {
    if (once) {
      const _cb = cb;
      cb = (...args) => {
        _cb(...args);
        watchHandle.stop();
      };
    }

    if (immediate) {
      cb(oldValue, undefined);
    }
  }

  return watchHandle;
}
