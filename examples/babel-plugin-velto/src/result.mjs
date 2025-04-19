import { element as _element2, text as _text2, append as _append, remove as _remove, markRender as _markRender } from "@velto/runtime";
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
      class: styles.wrap,
      onClick: i > 6 ? deletefrom10 : undefined
    });
    const _element3 = _element2("button", {
      disabled: true
    });
    const _text = _text2("test");
    return {
      mount(target, anchor) {
        _element.mount(target, anchor);
        _element3.mount(_element.el);
        _append(_element3.el, _text);
      },
      update(reactive) {
        _element.update({
          class: styles.wrap,
          onClick: i > 6 ? deletefrom10 : undefined
        });
        _element3.update({
          disabled: true
        });
      },
      destroy() {
        _element.destroy();
        _element3.destroy();
        _remove(_text);
      }
    };
  });
}