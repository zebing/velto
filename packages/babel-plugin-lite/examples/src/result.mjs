import { runtimeRef as _runtimeRef, element as _element, insert as _insert, remove as _remove, text as _text2, append as _append, isJSX as _isJSX, renderList as _renderList, classe as _classe, runtimeComputed as _runtimeComputed, expression as _expression, event as _event } from "@lite/lite";
import { ref as _runtimeRef } from "@lite/lite";
import styles from "./styles.module.scss";
let i = 0;
export default function List() {
  const list = _runtimeRef([{
    id: i++,
    name: '小张',
    grade: '一年级',
    age: 8
  }, {
    id: i++,
    name: '小王',
    grade: '二年级',
    age: 9
  }, {
    id: i++,
    name: '小李',
    grade: '一年级',
    age: 8
  }]);
  const unshift = () => {
    // list[0].name = 'name'
    for (let j = 0; j < 10; j++) {
      list.value.unshift({
        id: i++,
        name: '小丽 unshift',
        grade: '一年级',
        age: 8
      });
    }
  };
  const append = () => {
    list.value.push({
      id: i++,
      name: '小丽 append',
      grade: '一年级',
      age: 8
    });
  };
  const insert = () => {
    list.value.splice(2, 0, {
      id: i++,
      name: '小丽 insert',
      grade: '一年级',
      age: 8
    });
  };
  const deletefrom10 = () => {
    list.value.splice(10, 1);
  };
  const render = _renderList(list.value, () => {
    const _div2 = _element("div");
    const _text3 = _text2("test");
    return {
      [_isJSX]: true,
      mount(target, anchor) {
        _insert(target, _div2, anchor);
        _append(_div2, _text3);
      },
      update(reactive) {},
      destroy() {
        _remove(_div2);
      }
    };
  });
  const _div3 = _element("div");
  const _express = _expression(() => render, _div3, anchor, () => true);
  const _div4 = _element("div");
  const _text4 = _text2("List Component");
  const _button = _element("button");
  const _text5 = _text2("unshift");
  const _button2 = _element("button");
  const _text6 = _text2("append");
  const _button3 = _element("button");
  const _text7 = _text2("insert");
  const _button4 = _element("button");
  const _text8 = _text2("deletefrom10");
  const _div5 = _element("div");
  const _express2 = _expression(() => _renderList(list.value, student => {
    const _div11 = _element("div");
    const _div12 = _element("div");
    const _express7 = _expression(() => student.id, _div12, anchor, () => true);
    const _div13 = _element("div");
    const _express8 = _expression(() => student.name, _div13, anchor, () => true);
    const _div14 = _element("div");
    const _express9 = _expression(() => student.grade, _div14, anchor, () => true);
    const _div15 = _element("div");
    const _express10 = _expression(() => student.age, _div15, anchor, () => true);
    return {
      [_isJSX]: true,
      mount(target, anchor) {
        _insert(target, _div11, anchor);
        _classe(_div11, styles.item);
        _append(_div11, _div12);
        _express7.mount(_div12, anchor);
        _append(_div11, _div13);
        _express8.mount(_div13, anchor);
        _append(_div11, _div14);
        _express9.mount(_div14, anchor);
        _append(_div11, _div15);
        _express10.mount(_div15, anchor);
      },
      update(reactive) {},
      destroy() {
        _remove(_div11);
        _express7.destroy();
        _express8.destroy();
        _express9.destroy();
        _express10.destroy();
      }
    };
  }), _div5, anchor, () => true);
  return {
    [_isJSX]: true,
    mount(target, anchor) {
      _insert(target, _div3, anchor);
      _classe(_div3, styles.wrap);
      _express.mount(_div3, anchor);
      _append(_div3, _div4);
      _append(_div4, _text4);
      _append(_div3, _button);
      _event(_button, "onClick", unshift);
      _append(_button, _text5);
      _append(_div3, _button2);
      _event(_button2, "onClick", append);
      _append(_button2, _text6);
      _append(_div3, _button3);
      _event(_button3, "onClick", insert);
      _append(_button3, _text7);
      _append(_div3, _button4);
      _event(_button4, "onClick", deletefrom10);
      _append(_button4, _text8);
      _append(_div3, _div5);
      _classe(_div5, styles.list);
      _express2.mount(_div5, anchor);
    },
    update(reactive) {
      if ([list].includes(reactive)) _classe(_div5, styles.list);
      if ([list].includes(reactive)) {
        _express2.update(reactive);
      }
    },
    destroy() {
      _remove(_div3);
      _express.destroy();
      _express2.destroy();
    }
  };
}