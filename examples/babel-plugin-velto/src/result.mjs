import { element as _element2, text as _text2, append as _append, remove as _remove, renderList as _renderList, expression as _expression, markRender as _markRender } from "@velto/runtime";
import { ref } from "@velto/runtime";
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
    const _element = _element2("div", {
      class: styles.wrap
    });
    const _element3 = _element2("div", {});
    const _text = _text2("text");
    const _element4 = _element2("div", {
      class: styles.list
    });
    const _renderList2 = _renderList(list.value, ({
      id
    }, _index, _array) => _markRender(() => {
      const _element5 = _element2("div", {
        class: styles.item
      });
      const _element6 = _element2("div", {});
      const _express2 = _expression(student.id);
      return {
        mount(target, anchor) {
          _element5.mount(target, anchor);
          _element6.mount(_element5.el);
          _express2.mount(_element6.el);
        },
        update(reactive) {
          _element5.update({
            class: styles.item
          });
          _express2.update(student.id);
        },
        destroy() {
          _element5.destroy();
          _element6.destroy();
          _express2.destroy();
        }
      };
    }));
    const _express = _expression(_renderList2);
    return {
      mount(target, anchor) {
        _element.mount(target, anchor);
        _element3.mount(_element.el);
        _append(_element3.el, _text);
        _element4.mount(_element.el);
        _express.mount(_element4.el);
      },
      update(reactive) {
        _element.update({
          class: styles.wrap
        });
        _element4.update({
          class: styles.list
        });
        _express.update(list.value);
      },
      destroy() {
        _element.destroy();
        _element3.destroy();
        _remove(_text);
        _element4.destroy();
        _express.destroy();
      }
    };
  });
}