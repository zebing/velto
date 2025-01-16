import { ref } from "@lite/lite"

import styles from "./styles.module.scss";

interface Student {
  id: number;
  name: string;
  grade: string,
  age: number;
}
let i = 0;

export default function List() {
  const list = ref<Student[]>([
    { id: i++, name: '小张', grade: '一年级', age: 8 },
    { id: i++, name: '小王', grade: '二年级', age: 9 },
    { id: i++, name: '小李', grade: '一年级', age: 8 },
  ])
  const unshift = () => {
    // list.value[0].name = 'name'
    for(let j = 0; j < 10; j++) {
      list.value.unshift({ id: i++, name: '小丽 unshift', grade: '一年级', age: 8 });
    }
  }

  const append = () => {
    list.value.push({ id: i++, name: '小丽 append', grade: '一年级', age: 8 });
  }

  const insert = () => {
    list.value.splice(2, 0, { id: i++, name: '小丽 insert', grade: '一年级', age: 8 });
  }

  const deletefrom10 = () => {
    list.value = [];
  }
 
  return (
    <div class={styles.wrap}>
      <div>List Component</div>
      <button onClick={unshift}>unshift</button>
      <button onClick={append}>append</button>
      <button onClick={insert}>insert</button>
      <button onClick={deletefrom10}>deletefrom10</button>
      <div class={styles.list}>
        {list.value.map((student) => (
          <div class={styles.item}>
            <div>{student.id}</div>
            <div>{student.name}</div>
            <div>{student.grade}</div>
            <div>{student.age}</div>
          </div>
        ))}
      </div>
    </div>
  )
}