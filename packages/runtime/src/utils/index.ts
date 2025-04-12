import { isFunction, isString } from "@lite/shared";
import { Render } from "../types";

export * from './toDisplayString';

export function markRender(fn: Function) {
  const render = fn as Render;
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