import type { Reactive } from "./types";
import { ComponentInstance, callHook, LifecycleHooks, setCurrentInstance } from "../component";
import type { BaseTemplate } from "../types";

export type EffectType = ComponentEffect;
export let activeEffect: EffectType | undefined;
export let shouldTrackEffect = false;


class Effect {
  public run(fn: () => void) {
    let lastShouldTrack = shouldTrackEffect;
    let lastEffect = activeEffect;
    try {
      shouldTrackEffect = true;
      activeEffect = this as unknown as ComponentEffect;
      return fn();
    } finally {
      activeEffect = lastEffect;
      shouldTrackEffect = lastShouldTrack;
    }
  }
}

export class ComponentEffect extends Effect {
  protected template!: BaseTemplate;
  constructor(public instance: ComponentInstance) {
    super();
    this.run(() => {
      setCurrentInstance(instance);
      this.template = this.instance.type(this.instance.props, {});
    });
    callHook(LifecycleHooks.CREATED, this.instance);
  }

  public mount(target: Element, anchor?: Element) {
    callHook(LifecycleHooks.BEFORE_MOUNT, this.instance);
    this.run(() => {
      this.template.mount(target, anchor);
    });
    this.instance.isMounted = true;
    callHook(LifecycleHooks.MOUNTED, this.instance);
  }

  public update(reactive: Reactive) {
    callHook(LifecycleHooks.BEFORE_UPDATE, this.instance);
    this.run(() => {
      this.template.update();
    });
    callHook(LifecycleHooks.UPDATED, this.instance);
  }

  public destroy() {
    callHook(LifecycleHooks.BEFORE_DESTROY, this.instance);
    this.run(this.template.destroy);
    callHook(LifecycleHooks.DESTROYED, this.instance);
  }
}
