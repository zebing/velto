import { isFunction, isRenderFn, isArray, isString, isNativeTag, toDisplayString } from "./utils";
import { Component, buildComponent, Props } from "./component";
import { insert, remove, text } from "./nodeOps";
import { Ref } from "./ref";

export * from './nodeOps';
export * from './propsOps';
export * from './component';
export * from './ref';

export function normalizeContainer(
  container: Element | string | null
): Element | null {
  if (isString(container)) {
    return document.querySelector(container as string);
  }

  return container as Element;
}

export function createApp(type: Component, containerOrSelector: HTMLElement| Element | string | null, init: Props = {}) {
  const container = normalizeContainer(containerOrSelector);

  if (container) {
    container.innerHTML = '';
    const component = buildComponent(type, init);
    component.mount(container);
  }
}

export function expression(expressContainerFunction: any) {
  const express = expressContainerFunction();
  if (isFunction(express) && express.name === 'render') {
    return express();
  }

  const id = text(toDisplayString(express));
  
  return {
    mount(target: Element, anchor?: Element) {
      insert(target, id, anchor);
    },
    update(ref: Ref) {
      id.textContent = toDisplayString(expressContainerFunction());
    },
    destroy() {
      remove(id);
    }
  }
}
