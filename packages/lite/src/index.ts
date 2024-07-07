import { isFunction, isRenderFn, isArray, isString, isNativeTag, toDisplayString } from "./utils";
import { Component, buildComponent, Props, RenderResult } from "./component";
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

export function expression(expressContainerFunction: any): RenderResult {
  const express = expressContainerFunction();
  if (isRenderFn(express)) {
    return express();
  }

  if (isArray(express) && isRenderFn(express[0])) {
    let cache: RenderResult[] = [];
    let catchTarget: Element; 
    let cahceAnchor: Element | undefined;

    return {
      mount(target: Element, anchor?: Element) {
        catchTarget = target;
        cahceAnchor = anchor;
        const renderList = express;
        renderList.forEach((render, index) => {
          const renderResult = cache[index] = render();
          renderResult.mount(target, anchor);
        });
      },
      update(ref: Ref) {
        const renderList = expressContainerFunction() as (() => RenderResult)[];
        renderList.forEach((render, index) => {
          let renderResult = cache[index]

          if (renderResult) {
            return renderResult.update(ref);
          }
          renderResult = cache[index] = render();
          renderResult.mount(catchTarget, cahceAnchor);
        });

        for(let i = renderList.length; i < cache.length; i++) {
          cache[i].destroy();
        }
      },
      destroy() {
        cache.map(render => render.destroy());
        cache = [];
      }
    }
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
