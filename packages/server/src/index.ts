import { Component, Props, ssrComponent } from "./ssrComponent";
import { escapeHtml } from "@velto/shared";

export * from './ssrComponent';
export * from './ssrExpression';
export * from './ssrRenderList';
export * from './ssrAttribute';
export { markRender } from './utils';

export const ssrEscapeHtml = escapeHtml;

export function renderToString(type: Component, init: Props = {}) {
  const render = ssrComponent(type, init);
  return render();
}

export type * from './types';