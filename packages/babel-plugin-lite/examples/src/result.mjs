import { createElement as _createElement, element as _element2, insert as _insert, append as _append, expression as _expression, isTemplate as _isTemplate, renderList as _renderList, text as _text, condition as _condition4 } from "@lite/lite";
import { ref } from "@lite/lite";
import styles from "./styles.module.scss";
let i = 0;
export default function List() {
  let state = ref(true);
  const list = ref([{
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
      list.unshift({
        id: i++,
        name: '小丽 unshift',
        grade: '一年级',
        age: 8
      });
    }
  };
  const append = () => {
    list.push({
      id: i++,
      name: '小丽 append',
      grade: '一年级',
      age: 8
    });
  };
  const insert = () => {
    list.splice(2, 0, {
      id: i++,
      name: '小丽 insert',
      grade: '一年级',
      age: 8
    });
  };
  const deletefrom10 = () => {
    list.splice(10, 1);
  };
  const render = _renderList(() => list, (_, _index, _array) => {
    const {
      id
    } = _array[_index];
    const _div3 = _createElement("div");
    const _element4 = _element2(_div3, _insert, () => ({
      class: styles.item
    }));
    const _div4 = _createElement("div");
    const _element5 = _element2(_div4, _append, () => ({}));
    const _express2 = _expression(() => id);
    return {
      [_isTemplate]: true,
      mount(target, anchor) {
        _element4.mount(target, anchor);
        _element5.mount(_div3);
        _express2.mount(_div4, anchor);
      },
      update(reactive) {
        _element4.update(reactive);
        _element5.update(reactive);
        _express2.update(reactive);
      },
      destroy() {
        _element4.destroy();
        _element5.destroy();
        _express2.destroy();
      }
    };
  });
  const _div5 = _createElement("div");
  const _element6 = _element2(_div5, _insert, () => ({
    class: styles.wrap
  }));
  const _spaceAnchor = _text(" ");
  const _express3 = _expression(() => state);
  const _condition3 = _condition4(_express3, () => test);
  return {
    [_isTemplate]: true,
    mount(target, anchor) {
      _element6.mount(target, anchor);
      _append(_div5, _spaceAnchor);
      _condition3.mount(_div5, _spaceAnchor);
    },
    update(reactive) {
      _element6.update(reactive);
      _condition3.update(reactive);
    },
    destroy() {
      _element6.destroy();
      _condition3.destroy();
    }
  };
}