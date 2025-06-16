import { ssrComponent as _ssrComponent, ssrRenderList as _ssrRenderList, ssrExpression as _ssrExpression, markRender as _markRender } from "@velto/runtime";
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
  const _renderTest = _ssrComponent(Test, {
    name: "test",
    onClick: () => {},
    style: {
      color: 'red'
    }
  });
  const _renderList = _ssrRenderList(list.value, ({
    id
  }, _index, _array) => _markRender(() => {
    return `
  <div class=${styles.item}>
    <div>
      ${_ssrExpression(student.id)}
    </div>
  </div>`;
  }));
  const _renderList2 = _ssrRenderList(list, (student, _index2, _array2) => _markRender(() => {
    return `
  <div class=${styles.item}>
    <div>
      ${_ssrExpression(student.id)}
    </div>
    <div>
      ${_ssrExpression(student.name)}
    </div>
    <div>
      ${_ssrExpression(student.grade)}
    </div>
    <div>
      ${_ssrExpression(student.age)}
    </div>
  </div>`;
  }));
  return _markRender(() => {
    return `
  <div${Object.entries(styles).map(([key, value]) => ` ${key}=${value}`)} disabled="true" test="test" class=${styles.wrap}>
    ${_renderTest()}
    <button disabled="true">
      test
    </button>
    <div>
      <div>
        text
      </div>
    </div>
    <div class=${styles.list}>
      ${_ssrExpression(_renderList)}
    </div>${state ? `
      <div>
        Logical jsx
      </div>` : ""}
    ${_ssrExpression(render)}
    <div>
      List Component
    </div>
    <button>
      unshift
    </button>
    <button>
      append
    </button>
    <button>
      insert
    </button>
    <button>
      deletefrom10
    </button>
    <div class=${styles.list}>
      ${_ssrExpression(_renderList2)}
    </div>
  </div>`;
  });
}