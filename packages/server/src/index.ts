import { Component, Props, ssrComponent } from "./ssrComponent";

export * from './ssrComponent';
export * from './ssrExpression';
export * from './ssrRenderList';
export { markRender } from './utils';

export function renderToString(type: Component, init: Props = {}) {
  const render = ssrComponent(type, init);
  return render();
}

export type * from './types';