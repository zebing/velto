import { ref } from "@velto/runtime"

import styles from "./styles.module.scss";

let i = 0;

export default function List() {
  let state = ref(true)
  const list = ref([
    { id: i++, name: '小张', grade: '一年级', age: 8 },
    { id: i++, name: '小王', grade: '二年级', age: 9 },
    { id: i++, name: '小李', grade: '一年级', age: 8 },
  ])
  const unshift = () => {
    // list[0].name = 'name'
    for(let j = 0; j < 10; j++) {
      list.unshift({ id: i++, name: '小丽 unshift', grade: '一年级', age: 8 });
    }
  }

  const append = () => {
    list.push({ id: i++, name: '小丽 append', grade: '一年级', age: 8 });
  }

  const insert = () => {
    list.splice(2, 0, { id: i++, name: '小丽 insert', grade: '一年级', age: 8 });
  }

  const deletefrom10 = () => {
    list.splice(10, 1);
  }
  const li = list.value.map(({id}) => (
    <div class={styles.item}>
      <div>{student.id}</div>
    </div>
  ))
  return (
    <div class={styles.wrap} onClick={i > 6  ? deletefrom10 : undefined} >
      {/* <button disabled>test</button> */}
      <Text>
        <div>text</div>
      </Text>
      <div class={styles.list}>
        {state ? li : 234}
      </div>
      {/* {state && <div>Logical jsx</div>} */}
      {render}
      {/* <div>List Component</div>
      <button onClick={unshift}>unshift</button>
      <button onClick={append}>append</button>
      <button onClick={insert}>insert</button>
      <button onClick={deletefrom10}>deletefrom10</button>
      <div class={styles.list}>
        {list.map((student) => (
          <div class={styles.item}>
            <div>{student.id}</div>
            <div>{student.name}</div>
            <div>{student.grade}</div>
            <div>{student.age}</div>
          </div>
        ))}
      </div> */}
    </div>
 
)
}