import { ComponentContext, getComponentContext } from "../runtime/component/componentContext";
import type { Ref } from "./ref";

// WeakMap {
//   name1: Set[ComponentContext1, ComponentContext2]
//   name2: Set[ComponentContext1, ComponentContext2]
// }
const contextMap = new WeakMap<object, Set<ComponentContext>>();

export function track(key: Ref<any>) {
  const ctx = getComponentContext();
  let dep = contextMap.get(key);

  if (!dep) {
    dep = new Set<ComponentContext>();
    contextMap.set(key, dep);
  }

  if (ctx) {
    dep.add(ctx);
  }

  console.log('+++++dep', dep)
}

export function trigger(key: Ref<any>) {
  const dep = contextMap.get(key);
  dep?.forEach((ctx) => {
    // beforeUpdate hook
    if (ctx.beforeUpdate?.length) {
      ctx.beforeUpdate.forEach(beforeUpdate => beforeUpdate())
    }

    ctx.effects.forEach((effect) => effect());

    // updated hook
    if (ctx.updated?.length) {
      ctx.updated.forEach(updated => updated());
    }
  })
}