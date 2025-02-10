interface Template {
  mount: (target: Element, anchor?: Element) => void;
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
  update: (newProps: Record<string, unknown>) => void;
}

export interface RenderListTemplate extends Template {
  update: (newList: unknown[]) => void;
}

export interface Render extends Function {
  __isRender: boolean;
}

