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

export function expression(expressWrap: () => any, conditionWrap: () => boolean): RenderResult {
  const hasCondition = !!conditionWrap;
  let template: RenderResult = expressWrap();
  let cachedTarget: Element;
  let cachedAnchor: Element | undefined;

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
        const newTextContent = toDisplayString(express);

        if (!node) {
          node = text(newTextContent);
          insert(cachedTarget, node, cachedAnchor);
        } else if (node.textContent !== newTextContent) {
          node.textContent = newTextContent;
        }
      },
      destroy: () => {
        if (node) {
          remove(node!);
          node = undefined;
        }
      },
    }
  }
  
  return {
    mount: (target: Element, anchor?: Element) => {
      cachedTarget = target;
      cachedAnchor = anchor;
      if (hasCondition) {
        return conditionWrap?.() ? template.mount(target, anchor) : undefined;
      }
      template.mount(target, anchor);
    },
    update(reactive: Reactive) {
      if (hasCondition) {
        return conditionWrap?.() ? template.mount(cachedTarget, cachedAnchor) : template.destroy();
      }
      template.update(reactive);
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
    [isJSX]: true,
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
