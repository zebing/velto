import type { Reactive } from "./types";
import { ComponentInstance, RenderResult, callHook, LifecycleHooks, setCurrentInstance } from "../component";

export type EffectType = ComponentEffect;
export let activeEffect: EffectType | undefined;
export let shouldTrack = false;

class Effect {
  public run(fn: () => void) {
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this as unknown as ComponentEffect;
      return fn();
    } finally {
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
}

export class ComponentEffect extends Effect {
  protected renderResult!: RenderResult;
  constructor(public instance: ComponentInstance) {
    super();
    this.run(() => {
      setCurrentInstance(instance);
      this.renderResult = this.instance.type(this.instance.props, {});
    });
    callHook(LifecycleHooks.CREATED, this.instance);
  }

  public mount(target: Element, anchor?: Element) {
    callHook(LifecycleHooks.BEFORE_MOUNT, this.instance);
    this.run(() => {
      this.renderResult.mount(target, anchor);
    });
    callHook(LifecycleHooks.MOUNTED, this.instance);
  }

  public update(ref: Reactive) {
    callHook(LifecycleHooks.BEFORE_UPDATE, this.instance);
    this.run(() => {
      this.renderResult.update(ref);
    });
    callHook(LifecycleHooks.UPDATED, this.instance);
  }

  public destroy() {
    callHook(LifecycleHooks.BEFORE_DESTROY, this.instance);
    this.run(this.renderResult.destroy);
    callHook(LifecycleHooks.DESTROYED, this.instance);
  }
}
