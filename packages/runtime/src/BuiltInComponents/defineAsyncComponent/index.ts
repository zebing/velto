import { Component } from "../../component";
import { isFunction } from "@velto/shared";
import { markRender } from "../../utils";
import { CompileTemplate } from "../../types";
import { comment, append } from "../../dom";

export type AsyncComponentResolveResult<T = Component> = T | { default: T };

export type AsyncComponentLoader<T = any> = () => Promise<
  AsyncComponentResolveResult<T>
>;

export interface ErrorComponentProps {
  props: Record<string, unknown>,
  err: Error,
  retry: () => void,
  retries: number,
}

export interface AsyncComponentOptions<T = any> {
  loader: AsyncComponentLoader<T>;
  loadingComponent?: Component<Record<string, unknown>>;
  errorComponent?: Component<ErrorComponentProps>;
  timeout?: number;
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
  let cacheAnchor: Comment | undefined = undefined;

  const getComment = (): Comment => {
    if (!cacheAnchor) {
      return comment('');
    }

    return cacheAnchor;
  }

  const renderComponent = <T extends Record<string, unknown>>(currentComponent?: Component<T>, props: T = {} as T) => {
    componentTemplate?.destroy();

    if (currentComponent) {
      const cacheAnchor = getComment();
      const componentRender = currentComponent(props);
      componentTemplate = componentRender?.();
      componentTemplate?.mount(cacheTarget, cacheAnchor);
    }
  }

  const retry = async () => {
    retries++;
    renderComponent(loadingComponent, props);
    await load();
  };

  const load = async (): Promise<any> => {
    let loadingPromise = new Promise((resolve, reject) => {
      loader().then(resolve).catch(reject);

      if (timeout) {
        setTimeout(() => {
          const err = new Error(
            `Async component timed out after ${timeout}ms.`,
          );
          reject(err);
        }, timeout);
      }
    });

    return  loadingPromise.then((compModule: any) => {
        if (isFunction(compModule?.default) && (compModule?.__esModule || compModule?.[Symbol.toStringTag] === "Module")) {
          compModule = compModule.default;
        }
        return compModule;
      }).then((comp: Component) => {
        renderComponent(comp, props);
      }).catch((err) => {
        renderComponent(errorComponent, {
          props,
          err: err instanceof Error ? err : new Error(String(err)),
          retry,
          retries,
        });
      });
  };

  return (init: Record<string, unknown>) => {
    props = init;

    return markRender(() => ({
      mount: (target, anchor) => {
        const cacheAnchor = getComment();
        cacheTarget = target;
        append(target, cacheAnchor);
        renderComponent(loadingComponent, props),
        load();
      },
      update() {
        componentTemplate?.update();
      },
      destroy() {
        componentTemplate?.destroy();
      }
    }))
  };
}
