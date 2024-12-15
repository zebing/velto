import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref,
} from "@lite/lite"
import styles from './styles.module.scss';

export default function LogicalExpression() {
  let state = ref(true)
  const state1 = ref(true)
  
  const click = () => {
    state = !state;
  }
  return (
    <div class={styles.wrap}>
      <div>Logical start</div>
      <button onClick={click}>click</button>
      {state && <div>Logical jsx</div>}
      <div>Logical object: {state && {test: true}}</div>
      <div>Logical number: {state  && state1 && 2}</div>
      <div onClick={click}>Logical end</div>
    </div>
  )
}