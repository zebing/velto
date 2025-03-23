import { Component } from "../component";
import { isFunction, markRender } from "../utils";
import { CompileTemplate } from "../types";
import { text, append } from "../dom";

export type AsyncComponentResolveResult<T = Component> = T | { default: T }; // es modules

export type AsyncComponentLoader<T = any> = () => Promise<
  AsyncComponentResolveResult<T>
>;

export interface AsyncComponentOptions<T = any> {
  loader: AsyncComponentLoader<T>;
  loadingComponent?: Component;
  errorComponent?: Component<{
    props: Record<string, unknown>,
    err: Error,
    retry: () => void,
    retries: number,
  }>;
  delay?: number;
  timeout?: number;
  suspensible?: boolean;
}

export function defineAsyncComponent(source: AsyncComponentLoader<Component> | AsyncComponentOptions<Component>): Component {
  if (isFunction(source)) {
    source = { loader: source };
  }

  const {
    loader,
    loadingComponent,
    errorComponent,
    timeout,
  } = source;

  let retries = 0;
  let componentTemplate: CompileTemplate | undefined;
  let props: Record<string, unknown> = {};
  let cacheTarget: Element;
  const cacheAnchor = text(" ");
  
  const retry = () => {
    retries++;
    return load();
  };

  const load = async (): Promise<any> => {
    let loadingPromise = loader();
    return  loadingPromise.then((compModule: any) => {
        if (isFunction(compModule?.default) && (compModule?.__esModule || compModule?.[Symbol.toStringTag] === "Module")) {
          compModule = compModule.default;
        }
        return compModule;
      }).then((comp) => {
        componentTemplate?.destroy();
  
        const render = comp(props);
        componentTemplate = render();
        if (cacheTarget) {
          componentTemplate?.mount(cacheTarget, cacheAnchor);
        }
      }).catch((err) => {
        err = err instanceof Error ? err : new Error(String(err));
        componentTemplate?.destroy();
        const render = errorComponent?.({
          props,
          err,
          retry,
          retries,
        });
        componentTemplate = render?.();
        if (cacheTarget) {
          componentTemplate?.mount(cacheTarget, cacheAnchor);
        }
      });
  };

  return (init: Record<string, unknown>) => markRender(() => {
    props = init;
    
    const componentRender = loadingComponent?.(props);
    componentTemplate = componentRender?.();

    return {
      mount: (target: Element, anchor?: Element | Text) => {
        cacheTarget = target;
        append(target, cacheAnchor);
        componentTemplate?.mount(target, cacheAnchor);
        load();
      },
      update() {
        componentTemplate?.update();
      },
      destroy() {
        componentTemplate?.destroy();
      }
    }
  });
}
