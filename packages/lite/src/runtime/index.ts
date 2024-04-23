import { isFunction, isArray, isString, isNativeTag } from "../utils";
import { createText, appendChild } from "./nodeOps";
import { setProp, trackEffect, EffectWithEl, Style } from "./propsOps";
import { createComponent, ComponentContext, Component, getComponentContext } from "./component";

export * from './component';

export interface Props {
  name?: string;
  style?: Style;
  [key: string]: unknown,
};

export interface ReturnElement {
  el: Element | Text;
  componentContext?: ComponentContext[];
}

export function normalizeContainer(
  container: Element | string | null
): Element | null {
  if (isString(container)) {
    return document.querySelector(container as string);
  }

  return container as Element;
}

export function render(type: Component, containerOrSelector: HTMLElement| Element | string | null, init?: Props) {
  const container = normalizeContainer(containerOrSelector);

  if (container) {
    container.innerHTML = '';
    const child = createElement(type, init);

    if (child) {
      appendChild(child, container);
    }

    const ctx = getComponentContext();
    console.log('++++ctx', ctx?.unMounted, ctx)

    ctx?.unMounted?.forEach(unMounted => unMounted())
  }
}

export function createElement(type: string | Component | null, props?: Props | null, children?: unknown): Element | Text | null {
  if (!type) {
    return null;
  }
  if (isFunction(type)) {
    return createComponent(type, { ...(props ?? {}), children });
  }
  
  return createHtmlElement(type, props, children);
}

export function createHtmlElement(type: string | null, props?: Props | null, children?: unknown): Element | Text | null {
  if (!type) {
    return null;
  }

  if (!isNativeTag(type)) {
    const el = createText(type);
    if (props?.effect) {
      trackEffect(el, props?.effect as EffectWithEl);
    }
    
    return el;
  }
  
  const el = document.createElement(type);
  // set props
  for (const key in props) {
    setProp(el, key, props[key]);
  }

  if (children) {
    if (!isArray(children)) {
      children = [children];
    }

    (children as (unknown)[]).forEach(element => {
      if (element instanceof Element || element instanceof Text) {
        appendChild(element, el);
    
      } else {
        appendChild(createText(element as string), el);
      }
    });
  }
  
  return el;
}

export function createTextElement(type: string, props?: Props | null) {
  const el = createText(type);
  if (props?.effect) {
    trackEffect(el, props?.effect as EffectWithEl);
  }

  return el;
}
