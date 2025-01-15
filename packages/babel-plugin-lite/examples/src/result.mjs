import { createElement as _createElement, element as _element2, insert as _insert, append as _append, renderList as _renderList, expression as _expression } from "@lite/lite";
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
  const _div = _createElement("div");
  const _element = _element2(_div, {
    class: styles.wrap
  }, _insert);
  const _div2 = _createElement("div");
  const _element3 = _element2(_div2, {
    class: styles.list
  }, _append);
  const _renderList2 = _renderList(list.value, student => {
    const _div5 = _createElement("div");
    const _element6 = _element2(_div5, {
      class: styles.item
    }, _insert);
    const _div6 = _createElement("div");
    const _element7 = _element2(_div6, {}, _append);
    const _express3 = _expression(student.id);
    return {
      mount(target, anchor) {
        _element6.mount(target, anchor);
        _element7.mount(_div5);
        _express3.mount(_div6, anchor);
      },
      update(reactive) {
        _element6.update({
          class: styles.item
        });
        _element7.update({});
        _express3.update(student.id);
      },
      destroy() {
        _element6.destroy();
        _element7.destroy();
        _express3.destroy();
      }
    };
  });
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
      _express.update();
    },
    destroy() {
      _element.destroy();
      _element3.destroy();
      _express.destroy();
    }
  };
}