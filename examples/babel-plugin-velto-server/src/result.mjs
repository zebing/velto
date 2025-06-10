import { markRender as _markRender } from "@velto/server";
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
    return "<div class={styles.wrap} onClick={i > 6  ? deletefrom10 : undefined} >\n      <button disabled>test</button>\n      {/* <div>text</div>\n      <div class={styles.list}>\n        {list.value.map(({id}) => (\n            <div class={styles.item}>\n              <div>{student.id}</div>\n            </div>\n          ))}\n      </div> */}\n      {/* {state && <div>Logical jsx</div>} */}\n      {/* {render}\n      <div>List Component</div>\n      <button onClick={unshift}>unshift</button>\n      <button onClick={append}>append</button>\n      <button onClick={insert}>insert</button>\n      <button onClick={deletefrom10}>deletefrom10</button>\n      <div class={styles.list}>\n        {list.map((student) => (\n          <div class={styles.item}>\n            <div>{student.id}</div>\n            <div>{student.name}</div>\n            <div>{student.grade}</div>\n            <div>{student.age}</div>\n          </div>\n        ))}\n      </div> */}\n    </div>";
  });
}