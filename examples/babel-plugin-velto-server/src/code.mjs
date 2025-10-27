import { ref } from "@velto/runtime"

import styles from "./styles.module.scss";

let i = 0;

  const html = `
  <div>
  test html
  <span style="color: green;border: 1px solid blue;">test html</span>
  </div>
  `

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
  return <div>
    <div innerHTML={html}></div>
      <div textContent={html}></div>
  </div>
//   return (
//     <div {...styles} disabled test="test" class={styles.wrap} onClick={i > 6  ? deletefrom10 : undefined} >
//       <Test name="test" onClick={() => {}} style={{color: 'red'}} />
//       <button disabled>test</button>
//       <div>
//         <div>text</div>
//       </div>
//       <div class={styles.list}>
//         {list.value.map(({id}) => (
//             <div class={styles.item}>
//               <div>{student.id}</div>
//             </div>
//           ))}
//       </div>
//       {state && <div>Logical jsx</div>}
//       {render}
//       <div>List Component</div>
//       <button onClick={unshift}>unshift</button>
//       <button onClick={append}>append</button>
//       <button onClick={insert}>insert</button>
//       <button onClick={deletefrom10}>deletefrom10</button>
//       <div class={styles.list}>
//         {list.map((student) => (
//           <div class={styles.item}>
//             <div>{student.id}</div>
//             <div>{student.name}</div>
//             <div>{student.grade}</div>
//             <div>{student.age}</div>
//           </div>
//         ))}
//       </div>
//     </div>
 
// )
}