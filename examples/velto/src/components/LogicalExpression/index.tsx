import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref,
} from "@velto/runtime"
import styles from './styles.module.scss';

export default function LogicalExpression(props: Record<string, unknown>) {
  let state = ref(false)
  const state1 = ref(true)
  
  const click = () => {
    state.setValue(!state.value);
  }
  return (
    <div class={styles.wrap}>
      <div>Logical start</div>
      <button onClick={click}>click</button>
      {state.value && <div>Logical jsx</div>}
      <div>Logical object: {state.value && {test: true}}</div>
      <div>Logical number: {state.value  && state1.value && 2}</div>
      <div>{state.value ? props.children : null}</div>
      <div onClick={click}>Logical end</div>
    </div>
  )
}