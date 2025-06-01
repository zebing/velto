import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref,
} from "@velto/runtime"
import styles from './styles.module.scss';
import Test from '../Test';

export default function LogicalExpression(props: Record<string, unknown>) {
  let state = ref(false)
  const state1 = ref(true)
  
  const click = () => {
    state.setValue(!state.value);
    console.log('++++++', state)
  }
  return (
    <div class={styles.wrap}>
      <div>Logical start</div>
      <button onClick={click}>click</button>
      <button onClick={() => state1.setValue(!state1.value)}>click state1</button>
      {state.value && <div>Logical jsx</div>}
      <div>Logical object: {state.value && {test: true}}</div>
      <div>Logical number: {state.value  && state1.value && 2}</div>
      <div>state1: {state1.value ? true : false}</div>
      <div>{state.value ? props.children : null}</div>
      <div>{state.value ? <Test state={state1} /> : null}</div>
      <div onClick={click}>Logical end</div>
    </div>
  )
}