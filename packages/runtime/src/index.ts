import { normalizeContainer } from "./utils";
import { Component, component, Props } from "./component";

export * from '@velto/reactive';
export * from './dom';
export * from './element/attribute';
export * from './component';
export * from './element';
export * from './expression';
export * from './renderList';
export * from './condition';
export * from './defineAsyncComponent';
export { markRender } from './utils';

export function createApp(type: Component, containerOrSelector: HTMLElement| Element | string | null, init: Props = {}) {
  const container = normalizeContainer(containerOrSelector);

  if (container) {
    container.innerHTML = '';
    component(type, init).mount(container);
  }
}

export type * from './types';