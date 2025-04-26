import { normalizeContainer } from "./utils";
import { component, Props } from "./component";
import { isFunction } from "@velto/shared";
import { Template, Component } from "./types";
import { element } from "./element";
import { children } from "./children";
import { markRender } from "./utils";

export * from '@velto/reactive';
export * from './dom';
export * from './element/attribute';
export * from './component';
export * from './element';
export * from './expression';
export * from './renderList';
export * from './condition';
export * from './defineAsyncComponent';
export * from './text';
export { markRender } from './utils';

export function createApp(type: Component, containerOrSelector: HTMLElement| Element | string | null, init: Props = {}) {
  const container = normalizeContainer(containerOrSelector);

  if (container) {
    container.innerHTML = '';
    component(type, init).mount(container);
  }
}

export function createElement(
  type: string | Component,
  getProps: null | (() => Record<string, unknown>),
  childList?: Template[],
) {
  if (isFunction(type)) {
    const props = getProps?.() || {};
    if (childList?.length) {
      props.children = markRender(() => children(childList));
    }
    return component(type, props);
  }

  return element(type, getProps, childList);
}

export type * from './types';