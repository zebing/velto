import type { Reactive } from "./types";
import { ComponentInstance, callHook, LifecycleHooks, setCurrentInstance } from "../component";
import type { Template } from "../types";

export type EffectType = ComponentEffect;
export let activeEffect: EffectType | undefined;
export let shouldTrackEffect = false;
export let shouldTrackUpdate = false;
export let activeUpdate: (() => void) | undefined;

export function pauseTrackUpdate() {
  shouldTrackUpdate = false
}

export function enableTrackUpdate() {
  shouldTrackUpdate = true
}

export function setActiveUpdate(update?: () => void): unknown {
  let lastUpdate = activeUpdate;
 
  try {
    activeUpdate = update;
    return update?.();
  } finally {
    activeUpdate = lastUpdate;
  }
}

export function deleteUpdate(update: () => void): void {
  if (activeEffect) {
    activeEffect.instance.updateMap.forEach((map, reactive) => {
      if (map.has(update)) {
        map.delete(update);
      }
    })
  }
}

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
  protected template!: Template;
  constructor(public instance: ComponentInstance) {
    super();
    this.run(() => {
      setCurrentInstance(instance);
      this.template = this.instance.type(this.instance.props, {});
    });
    callHook(LifecycleHooks.CREATED, this.instance);
  }

  public render(target: Element, anchor?: Element) {
    callHook(LifecycleHooks.BEFORE_MOUNT, this.instance);
    this.run(() => {
      this.template.render(target, anchor);
    });
    this.instance.isMounted = true;
    callHook(LifecycleHooks.MOUNTED, this.instance);
  }

  public update(ref: Reactive) {
    callHook(LifecycleHooks.BEFORE_UPDATE, this.instance);
    this.run(() => {
      this.instance.updateMap.get(ref)?.forEach(fn => fn());
    });
    callHook(LifecycleHooks.UPDATED, this.instance);
  }

  public destroy() {
    callHook(LifecycleHooks.BEFORE_DESTROY, this.instance);
    this.run(this.template.destroy);
    callHook(LifecycleHooks.DESTROYED, this.instance);
  }
}
