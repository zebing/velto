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

export function expression(expressWrap: () => any, target: Element, anchor: Element | undefined, conditionWrap: () => boolean): {
  update: (reactive:Reactive) => void;
  destroy: () => void;
} {
  let cache: RenderResult[] = [];
  const express = expressWrap();
  const condition = conditionWrap();
  let node: Text | undefined;
  // @ts-ignore
  const isTemplate = isObject(express) && !!express[isJSX];
  if (condition) {
    if (isTemplate) {
      const { mount } = express;
      mount(target, anchor);
    } else if (isArray(express) && express[0]?.[isJSX]) {
      const renderList = express;
      renderList.forEach((template, index) => {
        const renderResult = cache[index] = template;
        renderResult.mount(target, anchor);
      });
    } else {
      node = text(toDisplayString(express));
      insert(target, node, anchor);
    }

    // if (isArray(express) && isRenderFn(express[0])) {
    //   let cache: RenderResult[] = [];
    //   let catchTarget: Element; 
    //   let cahceAnchor: Element | undefined;

    //   return {
    //     mount(target: Element, anchor?: Element) {
    //       catchTarget = target;
    //       cahceAnchor = anchor;
    //       const renderList = express;
    //       renderList.forEach((render, index) => {
    //         const renderResult = cache[index] = render();
    //         renderResult.mount(target, anchor);
    //       });
    //     },
    //     update(ref: Ref) {
    //       const renderList = expressContainerFunction() as (() => RenderResult)[];
    //       renderList.forEach((render, index) => {
    //         let renderResult = cache[index]

    //         if (renderResult) {
    //           return renderResult.update(ref);
    //         }
    //         renderResult = cache[index] = render();
    //         renderResult.mount(catchTarget, cahceAnchor);
    //       });

    //       for(let i = renderList.length; i < cache.length; i++) {
    //         cache[i].destroy();
    //       }
    //       cache.length = renderList.length;
    //     },
    //     destroy() {
    //       cache.map(render => render.destroy());
    //       cache = [];
    //     }
    //   }
    // }

    
  }
  
  return {
    update(reactive: Reactive) {
      const express = expressWrap();
      const condition = conditionWrap();
      // @ts-ignore
      const isTemplate = isObject(express) && !!express[isJSX];

      if (isTemplate) {
        if (condition) {
          express.mount(target, anchor);
        } else {
          express.destroy()
        }
        
      } else if (isArray(express) && express[0]?.[isJSX]){
        const renderList = express;
        renderList.forEach((render, index) => {
          let renderResult = cache[index]
          console.log(cache, renderList)

          if (renderResult) {
            return renderResult.update(reactive);
          }
          renderResult = cache[index] = render;
          renderResult.mount(target, anchor);
        });

        for(let i = renderList.length; i < cache.length; i++) {
          cache[i].destroy();
        }
        cache.length = renderList.length;
      } else {
        if (condition) {
          if (!node) {
            node = text(toDisplayString(express));
            insert(target, node, anchor);
          } else {
            node.textContent = toDisplayString(express);
          }
        } else {
          if(node) {
            remove(node!);
            node = undefined;
          }
        }
      }
    },
    destroy() {
      cache.map(render => render.destroy());
      cache = [];
      if (isTemplate) {
        express.destroy()
      } else {
        remove(node!);
      }
    }
  }
}
