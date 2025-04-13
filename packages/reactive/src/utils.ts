import { ReactiveFlags } from "./constant";
import { isObject } from '@velto/shared';

export const isReactive = (val: unknown): val is Record<any, any> =>
  isObject(val) &&
  (val[ReactiveFlags.IS_REF] || val[ReactiveFlags.IS_COMPUTED]);