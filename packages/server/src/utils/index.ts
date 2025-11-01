import { isFunction, isString, stringCurrying } from "@velto/shared";
import { SSRRender, RefFunction, SSRRenderFN } from "../types";
import type { Reactive } from "@velto/reactive";
import { isReactive } from '@velto/reactive';
import { ComponentInstance } from "../ssrComponent";

export * from './toDisplayString';

export function markRender(fn: SSRRenderFN) {
  const render = fn as SSRRender;
  render.__isRender = true;
  return render;
}

export function isRender(express: any) {
  return isFunction(express) && express.__isRender;
}

export function normalizeContainer(
  container: Element | string | null
): Element | null {
  if (isString(container)) {
    return document.querySelector(container as string);
  }

  return container as Element;
}

export function setRef(ref: Reactive | RefFunction, value: Element | ComponentInstance) {
  if (isFunction(ref)) {
    (ref as RefFunction)(value);
  } else if (isReactive(ref)) {
    (ref as Reactive)?.setValue?.(value);
  }
}

export const shouldIgnoreAttribute = stringCurrying(
  `key,ref,innerHTML,textContent`,
)