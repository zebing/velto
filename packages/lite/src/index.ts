import { isFunction, isRenderFn, isArray, isString, isNativeTag, toDisplayString, isObject } from "./utils";
import { Component, buildComponent, Props, RenderResult } from "./component";
import { insert, remove, text } from "./nodeOps";
import type { Reactive } from "./reactive";
import { isJSX } from "./constants";

export * from './nodeOps';
export * from './propsOps';
export * from './component';
export * from './reactive';
export * from './constants';

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

export function expression(expressWrap: () => any, target: Element, anchor: Element | undefined, conditionWrap: () => boolean): RenderResult {
  const condition = conditionWrap();
  let template: RenderResult = expressWrap();

  // @ts-ignore
  if (!(isObject(template) && !!template[isJSX])) {
    let express = template;
    let node: Text | undefined;
    template = {
      mount: (target: Element, anchor?: Element) => {
        node = text(toDisplayString(express));
        insert(target, node, anchor);
      },
      update: (ref: Reactive) => {
        express = expressWrap();
        if (!node) {
          node = text(toDisplayString(express));
          insert(target, node, anchor);
        } else {
          node.textContent = toDisplayString(express);
        }
      },
      destroy: () => {
        remove(node!);
        node = undefined;
      },
    }
  }
  
  return {
    mount: (target: Element, anchor?: Element) => {
      condition && template.mount(target, anchor);
    },
    update(reactive: Reactive) {
      condition ? template.update(reactive) : template.destroy();
    },
    destroy() {
      template.destroy();
    }
  }
}

export function renderList(data: any[] = [], renderCallback: (value: any, index: number, array: any[]) => any): RenderResult {
  const cached: RenderResult[] = [];
  let cacheTarget: Element;
  let cacheAnchor: Element | undefined;

  return {
    mount: (target: Element, anchor?: Element) => {
      cacheTarget = target;
      cacheAnchor = anchor;
      data.forEach((item, index) => {
        cached[index] = renderCallback(item, index, data);
        cached[index].mount(target, anchor);
      });
    },
    update(reactive: Reactive) {
      data.forEach((item, index) => {
        if (cached[index]) {
          cached[index].update(reactive);
        } else {
          cached[index] = renderCallback(item, index, data);
          cached[index].mount(cacheTarget, cacheAnchor);
        }
      });

      for (let i = data.length; i < cached.length; i++) {
        cached[i].destroy();
      }
      cached.length = data.length;
    },
    destroy() {
      for (let i = 0; i < cached.length; i++) {
        cached[i].destroy();
      }
      cached.length = 0;
    }
  }
}
