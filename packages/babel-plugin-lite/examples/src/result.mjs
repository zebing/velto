import { runtimeRef as _runtimeRef, element as _element, insert as _insert, remove as _remove, text as _text2, append as _append, isJSX as _isJSX, runtimeComputed as _runtimeComputed, buildComponent as _buildComponent, attr as _attr, event as _event } from "@lite/lite";
import '@lite/lite';
export function TestComponent() {
  const _div = _element("div");
  const _text = _text2("test component");
  return {
    [_isJSX]: true,
    mount(target, anchor) {
      _insert(target, _div, anchor);
      _append(_div, _text);
    },
    update(reactive) {},
    destroy() {
      _remove(_div);
    }
  };
}
export function TestJSXFragmentComponent() {
  let state1 = _runtimeRef({
    name: 'name'
  });
  const _div4 = _element("div");
  const _text4 = _text2("compoenent jsx ");
  const _div5 = _element("div");
  const _text5 = _text2("component child ");
  const _div2 = _element("div");
  const _text3 = _text2("test");
  const _div3 = _element("div");
  const _component = _buildComponent(TestComponent, {
    ...state1.value,
    name: "name",
    state: state1.value,
    onClick: click1,
    jsx: {
      [_isJSX]: true,
      mount(target, anchor) {
        _insert(target, _div4, anchor);
        _append(_div4, _text4);
      },
      update(reactive) {},
      destroy() {
        _remove(_div4);
      }
    },
    children: {
      [_isJSX]: true,
      mount(target, anchor) {
        _insert(target, _div5, anchor);
        _append(_div5, _text5);
      },
      update(reactive) {},
      destroy() {
        _remove(_div5);
      }
    }
  });
  return {
    [_isJSX]: true,
    mount(target, anchor) {
      _insert(target, _div2, anchor);
      _append(_div2, _text3);
      _insert(target, _div3, anchor);
      _component.mount(target, anchor);
    },
    update(reactive) {
      {
        _component.update(reactive);
      }
    },
    destroy() {
      _remove(_div2);
      _remove(_div3);
      _component.destroy();
    }
  };
}
export default function JSXElement() {
  let state = _runtimeRef({
    name: 'name'
  });
  const click = () => {
    state.value.name = 'new name';
  };
  const click1 = () => {
    state.value = {
      name: 'test name'
    };
  };
  const _div9 = _element("div");
  const _text7 = _text2("compoenent jsx ");
  const _div10 = _element("div");
  const _text8 = _text2("component child ");
  const _div6 = _element("div");
  const _div7 = _element("div");
  const _div8 = _element("div");
  const _text6 = _text2("jsx text");
  const _component2 = _buildComponent(TestComponent, {
    ...state.value,
    name: "name",
    state: state.value,
    onClick: click1,
    jsx: {
      [_isJSX]: true,
      mount(target, anchor) {
        _insert(target, _div9, anchor);
        _append(_div9, _text7);
      },
      update(reactive) {},
      destroy() {
        _remove(_div9);
      }
    },
    children: {
      [_isJSX]: true,
      mount(target, anchor) {
        _insert(target, _div10, anchor);
        _append(_div10, _text8);
      },
      update(reactive) {},
      destroy() {
        _remove(_div10);
      }
    }
  });
  return {
    [_isJSX]: true,
    mount(target, anchor) {
      _insert(target, _div6, anchor);
      for (const key in state.value) {
        _attr(_div6, key, state.value[key]);
      }
      _attr(_div6, "test1", state.value);
      _attr(_div6, "test", "test1");
      _attr(_div6, "html", "<div>test</div>");
      _attr(_div6, "html1", "<div>test1</div>");
      _event(_div6, "onClick", click);
      _append(_div6, _div7);
      _attr(_div7, "child", true);
      _append(_div6, _div8);
      _append(_div8, _text6);
      _component2.mount(target, anchor);
    },
    update(reactive) {
      if ([state].includes(reactive)) for (const key in state.value) {
        _attr(_div6, key, state.value[key]);
      }
      if ([state].includes(reactive)) {
        _attr(_div6, "test1", state.value);
      }
      {
        _component2.update(reactive);
      }
    },
    destroy() {
      _remove(_div6);
      _component2.destroy();
    }
  };
}