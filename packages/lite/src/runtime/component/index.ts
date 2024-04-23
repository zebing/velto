import type { Props } from "../index";
import { createComponentcomponentContext, pushComponentContext, popComponentContext, getComponentContext } from "./componentContext";
import { callUnstableFunc } from "../../utils";
import { callHook, LifecycleHooks } from "./lifecycle";

export { getComponentContext } from './componentContext';
export type { ComponentContext } from './componentContext';
export { onBeforeRender, onRendered, onBeforeUpdate, onUpdated, onUnmounted } from './lifecycle'

export type Component = (init: Record<string, unknown>, ctx: Record<string, unknown>) => Element | Text | null;

export function createComponent(component: Component, props: Props) {
  const ctx = createComponentcomponentContext();
  
  pushComponentContext(ctx);
  const el = callUnstableFunc<Component>(component, [props, {}]);
  popComponentContext();
  const parentComponent = getComponentContext();
  parentComponent?.subComponents.push(ctx);

  callHook(LifecycleHooks.RENDERED, ctx);

  return el;
}
