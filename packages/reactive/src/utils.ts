import { ReactiveFlags } from "./constant";

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === "object";

export const isReactive = (val: unknown): val is Record<any, any> =>
  isObject(val) &&
  (val[ReactiveFlags.IS_REF] || val[ReactiveFlags.IS_COMPUTED]);

export const isFunction = (val: unknown): val is Function =>
  typeof val === "function";

export function callUnstableFunc<F extends Function, R = null>(
  fn: F,
  args?: unknown[]
) {
  try {
    return fn(...(args ?? [])) as R;
  } catch (err) {
    console.log(err);
  }
  return null;
}
