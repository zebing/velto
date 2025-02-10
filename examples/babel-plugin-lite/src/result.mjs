import { createElement as _createElement, element as _element2, insert as _insert, append as _append, renderList as _renderList, expression as _expression, markRender as _markRender } from "@lite/runtime";
import { ref } from "@lite/runtime";
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
  return _markRender(() => {
    const _div = _createElement("div");
    const _element = _element2(_div, {
      class: styles.wrap
    }, _insert);
    const _div2 = _createElement("div");
    const _element3 = _element2(_div2, {
      class: styles.list
    }, _append);
    const _renderList2 = _renderList(list.value, ({
      id
    }, _index, _array) => _markRender(() => {
      const _div3 = _createElement("div");
      const _element4 = _element2(_div3, {
        class: styles.item
      }, _insert);
      const _div4 = _createElement("div");
      const _element5 = _element2(_div4, {}, _append);
      const _express2 = _expression(student.id);
      return {
        mount(target, anchor) {
          _element4.mount(target, anchor);
          _element5.mount(_div3);
          _express2.mount(_div4, anchor);
        },
        update(reactive) {
          const {
            id
          } = list.value[_index];
          _element4.update({
            class: styles.item
          });
          _element5.update({});
          _express2.update(student.id);
        },
        destroy() {
          _element4.destroy();
          _element5.destroy();
          _express2.destroy();
        }
      };
    }));
    const _express = _expression(_renderList2);
    return {
      mount(target, anchor) {
        _element.mount(target, anchor);
        _element3.mount(_div);
        _express.mount(_div2, anchor);
      },
      update(reactive) {
        _element.update({
          class: styles.wrap
        });
        _element3.update({
          class: styles.list
        });
        _express.update(list.value);
      },
      destroy() {
        _element.destroy();
        _element3.destroy();
        _express.destroy();
      }
    };
  });
}