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

  const scheduler = () => {
    const value = effect.run();
    if (!pause) {
      cb?.(value, oldValue);
    }
    oldValue = value;
  };
  scheduler.id = 0;
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
