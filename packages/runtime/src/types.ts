import { ComponentInstance } from "./component";
import { Ref } from "@velto/reactive";

export interface Template {
  mount: (target: Element, anchor?: Element | Comment) => void;
  destroy: () => void;
}

export interface CompileTemplate extends Template {
  update: () => void;
}

export interface ConditionTemplate extends Template {
  update: (newCondition: boolean, newExpress: any) => void;
}

export interface ExpressTemplate extends Template {
  update: (newExpress: any) => void;
}

export interface ElementTemplate extends Template {
  el: Element;
  update: (newProps: Record<string, unknown>) => void;
}

export interface RenderListTemplate extends Template {
  update: (newList: unknown[]) => void;
}

export type RenderFN<T = CompileTemplate> = () => T;

export interface Render extends RenderFN { __isRender: boolean; }

export type RefFunction  = ((value: Element | ComponentInstance) => void);

export type PropsWithChildren<T = unknown> =  T & { children?: Render };
export type PropsWithRef<T = unknown> =  T & { ref?: Ref };