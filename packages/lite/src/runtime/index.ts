import { isFunction, isRenderFn, isArray, isString, isNativeTag, toDisplayString } from "../utils";
import { appendChild, createText } from "./nodeOps";
import { setProp, Style } from "./propsOps";
import { Component, createComponentInstance, Props, renderComponent, getCurrentInstance } from "./component";
import { createElement as nodeCreateElement } from "./nodeOps";

export {
  appendChild,
  insert,
  remove,
  createText,
  createComment,
  setText,
  setElementText,
  parentNode,
  nextSibling,
  querySelector,
} from './nodeOps';
export * from './component';

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
    const instance = createComponentInstance(type);
    renderComponent(container, instance, init);
  }
}

export function append(parent: Element, child: unknown) {
  if (isRenderFn(child)) {
    return child(parent);
  }

  appendChild(parent, createText(toDisplayString(child)));
}

export function createElement(tag: string, props: () => Props | null, isSVG?: boolean, is?: string) {
  const el = nodeCreateElement(tag, isSVG, is);
  let propsData: Props | null = isFunction(props) ? props() : props;
  const instance = getCurrentInstance();
  const effect = () => {
    // set props
    for (const key in propsData) {
      setProp(el, key, propsData[key]);
    }
  }
  instance?.effectList.push(effect);
  effect();

  return el;
}
