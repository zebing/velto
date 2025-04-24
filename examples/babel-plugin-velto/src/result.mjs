import { renderList as _renderList, expression as _expression, createElement as _createElement, markRender as _markRender, condition as _condition } from "@velto/runtime";
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
  const li = _renderList(list.value, ({
    id
  }, _index, _array) => _markRender(() => {
    return _createElement("div", {
      class: styles.item
    }, [_createElement("div", null, [_expression(student.id)])]);
  }));
  return _markRender(() => {
    return _createElement("div", {
      class: styles.wrap,
      onClick: i > 6 ? deletefrom10 : undefined
    }, [_createElement("div", {
      class: styles.list
    }, [_condition(state, _expression(li)), _condition(!state, _expression(234))])]);
  });
}