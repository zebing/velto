import { runtimeRef as _runtimeRef, element as _element, insert as _insert, remove as _remove, classe as _classe, text as _text, append as _append, runtimeComputed as _runtimeComputed, expression as _expression, isJSX as _isJSX } from "@lite/lite";
import "@lite/lite";
import styles from "./styles.module.scss";
let i = 0;
export default function List() {
  let state = _runtimeRef(true);
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
  // const render = list.map(() => <div>test</div>)
  const _div = _element("div");
  const _spaceAnchor = _text(" ");
  const _express = _expression(() => state.value, () => test);
  return {
    [_isJSX]: true,
    mount(target, anchor) {
      _insert(target, _div, anchor);
      _classe(_div, styles.wrap);
      _append(_div, _spaceAnchor);
      _express.mount(_div, _spaceAnchor);
    },
    update(reactive) {
      if ([state].includes(reactive)) {
        _express.update(reactive);
      }
    },
    destroy() {
      _remove(_div);
      if (test) _express.destroy();
    }
  };
}