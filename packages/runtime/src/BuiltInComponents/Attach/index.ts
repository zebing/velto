import type { PropsWithChildren, Render } from "../../types";
import { Reactive, watch } from "@velto/reactive";
import { markRender } from "../../utils";

export interface AttachProps {
  to?: string | Element;
  disabled?: Reactive<boolean>;
  defer?: Reactive<boolean>;
}

export function Attach(props: PropsWithChildren<AttachProps>) {
  const { to, children, disabled, defer } = props;

  let isMounted = false;
  let fallbackTarget: Element | undefined;
  let fallbackAnchor: Element | Comment | undefined;

  const targetElement: Element | undefined =
    to instanceof Element ? to : (typeof to === 'string' ? document.querySelector(to) || undefined : undefined);

  const template = children?.();

  function tryMount(disabled?: Reactive<boolean>, defer?: Reactive<boolean>) {
    if (defer?.value) return;

    const mountTarget = disabled?.value ? fallbackTarget : targetElement;
    const mountAnchor = disabled?.value ? fallbackAnchor : undefined;

    template?.mount(mountTarget!, mountAnchor);
    isMounted = true;
  }

  if (disabled || defer) {
    watch(() => [disabled?.value, defer?.value], () => {
      if (!isMounted) {
        tryMount(disabled, defer);
      } else {
        template?.update();
      }
    });
  }

  

  return markRender(() =>  ({
    mount(target, anchor) {
      fallbackTarget = target;
      fallbackAnchor = anchor;

      tryMount(props.disabled, props.defer);
    },

    update() {
      template?.update();
    },

    destroy() {
      template?.destroy();
    }
  }));
}
