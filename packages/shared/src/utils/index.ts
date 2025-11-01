import { stringCurrying } from './stringCurrying';
import { HTML_TAGS, SVG_TAGS, BOOLEAN_ATTRIBUTE } from '../constants';

export * from './stringCurrying';
export * from './escapeHtml';
export * from './normalizeAttribute';

export const isHTMLTag = stringCurrying(HTML_TAGS, true);
export const isSVGTag = stringCurrying(SVG_TAGS, true);
export const isBooleanAttribute = stringCurrying(BOOLEAN_ATTRIBUTE, true);
export const isNativeTag = (name: string) => isHTMLTag(name) || isSVGTag(name);
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isFunction = (val: unknown): val is Function => typeof val === 'function';
export const isRenderFn = (fn: unknown): fn is Function => isFunction(fn) && fn.name.indexOf('render') !== -1;
export const isArray = Array.isArray;
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object';
export const toTypeString = (value: unknown): string => Object.prototype.toString.call(value);
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]';
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]';
export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]';
export const camelize = (str: string): string => str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
export const capitalize = (str: string) => (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<string>;
export const hyphenate = (str: string) => str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
export const hash = () => Math.random().toString(16).slice(2);
export const isEvent = (key: string) => /^on[^a-z]/.test(key);

export function callUnstableFunc<F extends Function, R = null>(
  fn: F,
  args?: unknown[],
) {
  try {
    return fn(...(args ?? [])) as R;
  } catch (err) {
    console.log(err);
  }
  return null;
}
export function omit<T extends Record<string, unknown>>(obj: T, keys: string[]): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  ) as Partial<T>;
}
