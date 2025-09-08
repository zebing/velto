import { ComponentInstance } from "./ssrComponent";
import { Ref } from "@velto/reactive";

export type SSRRenderFN<T = string> = () => T;

export interface SSRRender extends SSRRenderFN { __isRender: boolean; }

export type RefFunction  = ((value: Element | ComponentInstance) => void);

export type PropsWithChildren<T = unknown> =  T & { children?: SSRRender };
export type PropsWithRef<T = unknown> =  T & { ref?: Ref };