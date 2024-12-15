import { runtimeRef as _runtimeRef, runtimeComputed as _runtimeComputed, element as _element, insert as _insert, remove as _remove, classe as _classe, append as _append, text as _text2, event as _event, expression as _expression, isJSX as _isJSX } from "@lite/lite";
import "@lite/lite";
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
  const _div = _element("div");
  const _div2 = _element("div");
  const _text = _text2("List Component");
  const _button = _element("button");
  const _text3 = _text2("unshift");
  const _button2 = _element("button");
  const _text4 = _text2("append");
  const _button3 = _element("button");
  const _text5 = _text2("insert");
  const _button4 = _element("button");
  const _text6 = _text2("deletefrom10");
  const _div3 = _element("div");
  let _express;
  return {
    [_isJSX]: true,
    mount(target, anchor) {
      _insert(target, _div, anchor);
      _classe(_div, styles.wrap);
      _append(_div, _div2);
      _append(_div2, _text);
      _append(_div, _button);
      _event(_button, "onClick", unshift);
      _append(_button, _text3);
      _append(_div, _button2);
      _event(_button2, "onClick", append);
      _append(_button2, _text4);
      _append(_div, _button3);
      _event(_button3, "onClick", insert);
      _append(_button3, _text5);
      _append(_div, _button4);
      _event(_button4, "onClick", deletefrom10);
      _append(_button4, _text6);
      _append(_div, _div3);
      _classe(_div3, styles.list);
      const _div4 = _element("div");
      const _div5 = _element("div");
      let _express2;
      const _div6 = _element("div");
      let _express3;
      const _div7 = _element("div");
      let _express4;
      const _div8 = _element("div");
      let _express5;
      _express = _expression(() => list.value.map(student => ({
        [_isJSX]: true,
        mount(target, anchor) {
          _insert(target, _div4, anchor);
          _classe(_div4, styles.item);
          _append(_div4, _div5);
          _express2 = _expression(() => student.id, _div5, anchor, () => true);
          _append(_div4, _div6);
          _express3 = _expression(() => student.name, _div6, anchor, () => true);
          _append(_div4, _div7);
          _express4 = _expression(() => student.grade, _div7, anchor, () => true);
          _append(_div4, _div8);
          _express5 = _expression(() => student.age, _div8, anchor, () => true);
        },
        update(reactive) {},
        destroy() {
          _remove(_div4);
          _express2.destroy();
          _express3.destroy();
          _express4.destroy();
          _express5.destroy();
        }
      })), _div3, anchor, () => true);
    },
    update(reactive) {
      if ([list].includes(reactive)) _classe(_div3, styles.list);
      if ([list].includes(reactive)) {
        _express.update(reactive);
      }
    },
    destroy() {
      _remove(_div);
      _express.destroy();
    }
  };
}