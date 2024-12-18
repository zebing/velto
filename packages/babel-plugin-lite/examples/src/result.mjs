import { runtimeRef as _runtimeRef, element as _element, insert as _insert, remove as _remove, attr as _attr, classe as _classe, append as _append, event as _event, text as _text2, expression as _expression, isJSX as _isJSX } from "@lite/lite";
import { onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeDestroy, onDestroyed, ref as _runtimeRef, RefImpl } from "@lite/lite";
import styles from "./styles.module.scss";
export default function Test() {
  const style = _runtimeRef < string > styles.blue;
  const refStyle = _runtimeRef < RefImpl < string >> style;
  const state = _runtimeRef < {
    name: string
  } > {
    name: 'name'
  };
  const refState = _runtimeRef < {
    name: string
  } > state;
  console.log(style.value, state.name);
  const name = 'name';
  onCreated(() => {
    console.log('+++style', style === refStyle, refState === state);
    console.log('+++++Test onCreated');
  });
  onBeforeMount(() => {
    console.log('+++++Test onBeforeMount');
  });
  onMounted(() => {
    console.log('+++++Test onMounted');
  });
  onBeforeUpdate(() => {
    console.log('+++++Test onBeforeUpdate');
  });
  onUpdated(() => {
    console.log('+++++Test onUpdated');
  });
  onBeforeDestroy(() => {
    console.log('+++++Test onBeforeDestroy');
  });
  onDestroyed(() => {
    console.log('+++++Test onDestroyed');
  });
  const click = () => {
    console.log('+++++++click');
    state.name = 'new name';
    style.value = styles.green;
  };
  const _div = _element("div");
  const _div2 = _element("div");
  const _text = _text2("change name");
  const _div3 = _element("div");
  const _text3 = _text2("name: ");
  const _express = _expression(() => refState.name, _div3, anchor, () => true);
  const _div4 = _element("div");
  const _express2 = _expression(() => style.value, _div4, anchor, () => true);
  const _div5 = _element("div");
  const _express3 = _expression(() => refStyle.value, _div5, anchor, () => true);
  return {
    [_isJSX]: true,
    mount(target, anchor) {
      _insert(target, _div, anchor);
      _attr(_div, "name", "name");
      _attr(_div, "state", name);
      _classe(_div, style.value);
      _append(_div, _div2);
      _event(_div2, "onClick", click);
      _append(_div2, _text);
      _append(_div, _div3);
      _append(_div3, _text3);
      _express.mount(_div3, anchor);
      _append(_div, _div4);
      _express2.mount(_div4, anchor);
      _append(_div, _div5);
      _express3.mount(_div5, anchor);
    },
    update(reactive) {},
    destroy() {
      _remove(_div);
      _express.destroy();
      _express2.destroy();
      _express3.destroy();
    }
  };
}